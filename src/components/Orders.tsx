
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Package, Bed, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Json } from "@/integrations/supabase/types";

interface Order {
  id: string;
  order_type: string; // Changed from 'medicine' | 'bed' to string to match what's coming from Supabase
  order_details: any;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

const statusIcons = {
  confirmed: <CheckCircle className="h-5 w-5 text-green-500" />,
  pending: <Clock className="h-5 w-5 text-orange-500" />,
  cancelled: <XCircle className="h-5 w-5 text-red-500" />,
  completed: <CheckCircle className="h-5 w-5 text-blue-500" />,
};

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [bedType, setBedType] = useState("");
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders' as any)
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        // Type assertion to convert the data to Order[]
        setOrders((data as any) || []);
      } catch (error: any) {
        console.error('Error fetching orders:', error.message);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);

  const handleUpdateBed = async () => {
    if (!selectedOrder || !bedType) return;
    
    const oldDetails = selectedOrder.order_details;
    const hospital = oldDetails.hospital;
    const selectedBedType = hospital.bedTypes.find((bed: any) => bed.type === bedType);
    
    if (!selectedBedType) {
      toast.error("Selected bed type not found");
      return;
    }
    
    const newPrice = selectedBedType.price * duration;
    
    try {
      const updatedDetails = {
        ...oldDetails,
        bedType,
        duration,
        admissionDate: oldDetails.admissionDate,
        totalPrice: newPrice,
        hospital: {
          ...oldDetails.hospital,
          selectedBedType: bedType
        }
      };
      
      const { error } = await supabase
        .from('orders' as any)
        .update({ 
          order_details: updatedDetails,
          total_amount: newPrice,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', selectedOrder.id);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              order_details: updatedDetails,
              total_amount: newPrice,
              updated_at: new Date().toISOString()
            } 
          : order
      ));
      
      setSelectedOrder(null);
      toast.success("Bed booking updated successfully");
    } catch (error: any) {
      console.error('Error updating bed booking:', error.message);
      toast.error('Failed to update bed booking');
    }
  };

  const openUpdateDialog = (order: Order) => {
    if (order.status === 'cancelled' || order.status === 'completed') {
      toast.error("Cannot modify a cancelled or completed order");
      return;
    }
    
    setSelectedOrder(order);
    
    if (order.order_type === 'bed') {
      setBedType(order.order_details.bedType || "");
      setDuration(order.order_details.duration || 1);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders' as any)
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled', updated_at: new Date().toISOString() } 
          : order
      ));
      
      toast.success("Order cancelled successfully");
    } catch (error: any) {
      console.error('Error cancelling order:', error.message);
      toast.error('Failed to cancel order');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You don't have any orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="medicine">Medicine Orders</TabsTrigger>
          <TabsTrigger value="bed">Bed Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <OrdersList 
            orders={orders} 
            openUpdateDialog={openUpdateDialog} 
            cancelOrder={cancelOrder} 
          />
        </TabsContent>
        
        <TabsContent value="medicine">
          <OrdersList 
            orders={orders.filter(order => order.order_type === 'medicine')} 
            openUpdateDialog={openUpdateDialog} 
            cancelOrder={cancelOrder}
          />
        </TabsContent>
        
        <TabsContent value="bed">
          <OrdersList 
            orders={orders.filter(order => order.order_type === 'bed')} 
            openUpdateDialog={openUpdateDialog} 
            cancelOrder={cancelOrder}
          />
        </TabsContent>
      </Tabs>
      
      {/* Update Bed Dialog */}
      {selectedOrder && selectedOrder.order_type === 'bed' && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Bed Booking</DialogTitle>
              <DialogDescription>
                Change your bed type or duration for your stay at {selectedOrder.order_details.hospital?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bedType">Bed Type</Label>
                <RadioGroup value={bedType} onValueChange={setBedType} className="space-y-3">
                  {selectedOrder.order_details.hospital?.bedTypes.map((bed: any) => (
                    <div 
                      key={bed.type}
                      className={`border rounded-lg p-3 transition-all ${bedType === bed.type ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                    >
                      <RadioGroupItem 
                        value={bed.type} 
                        id={`bed-${bed.type}`} 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor={`bed-${bed.type}`}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="font-medium text-purple-900">{bed.type}</div>
                          <div className="text-sm text-purple-700">
                            {bed.available} beds available
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-900">₹{bed.price.toLocaleString()}</div>
                          <div className="text-xs text-purple-700">per day</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 rounded-l-md"
                    onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </Button>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="h-9 rounded-none text-center w-16"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 rounded-r-md"
                    onClick={() => setDuration(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {bedType && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">Updated Booking Summary</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-purple-700">Bed Type:</div>
                    <div className="font-medium text-purple-900">{bedType}</div>
                    
                    <div className="text-purple-700">Admission Date:</div>
                    <div className="font-medium text-purple-900">
                      {selectedOrder.order_details.admissionDate ? format(new Date(selectedOrder.order_details.admissionDate), 'PPP') : 'N/A'}
                    </div>
                    
                    <div className="text-purple-700">Duration:</div>
                    <div className="font-medium text-purple-900">{duration} day{duration > 1 ? 's' : ''}</div>
                    
                    <div className="text-purple-700">Rate per Day:</div>
                    <div className="font-medium text-purple-900">
                      {selectedOrder.order_details.hospital?.bedTypes.find((b: any) => b.type === bedType)?.price.toLocaleString() || 'N/A'}
                    </div>
                    
                    <div className="text-purple-700 font-medium">Total Amount:</div>
                    <div className="font-bold text-purple-900">
                      ₹{((selectedOrder.order_details.hospital?.bedTypes.find((b: any) => b.type === bedType)?.price || 0) * duration).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBed} disabled={!bedType}>
                Update Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface OrdersListProps {
  orders: Order[];
  openUpdateDialog: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
}

function OrdersList({ orders, openUpdateDialog, cancelOrder }: OrdersListProps) {
  if (orders.length === 0) {
    return <div className="text-center py-4">No orders found</div>;
  }
  
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {order.order_type === 'medicine' ? (
                  <Package className="h-5 w-5 text-purple-600" />
                ) : (
                  <Bed className="h-5 w-5 text-purple-600" />
                )}
                <CardTitle className="text-sm font-medium">
                  {order.order_type === 'medicine' ? 'Medicine Order' : 'Bed Booking'} 
                  <span className="text-gray-500 ml-2">
                    #{order.id.substring(0, 8)}
                  </span>
                </CardTitle>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {statusIcons[order.status]}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            {order.order_type === 'medicine' ? (
              <div>
                <div className="mb-3">
                  <h4 className="font-medium">Order Items:</h4>
                  <div className="mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.order_details.items?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">₹{item.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <div>
                    <p className="font-medium">Total: ₹{order.total_amount}</p>
                    <p className="text-sm text-gray-500">
                      Ordered on {format(new Date(order.created_at), 'PPP')}
                    </p>
                  </div>
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <Button variant="outline" size="sm" onClick={() => cancelOrder(order.id)}>
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                  <div>
                    <h4 className="font-medium">Hospital:</h4>
                    <p>{order.order_details.hospital?.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Bed Type:</h4>
                    <p>{order.order_details.bedType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Admission Date:</h4>
                    <p>
                      {order.order_details.admissionDate 
                        ? format(new Date(order.order_details.admissionDate), 'PPP') 
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Duration:</h4>
                    <p>{order.order_details.duration} day{order.order_details.duration > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <div>
                    <p className="font-medium">Total: ₹{order.total_amount}</p>
                    <p className="text-sm text-gray-500">
                      Booked on {format(new Date(order.created_at), 'PPP')}
                      {order.updated_at !== order.created_at && 
                        ` (Updated: ${format(new Date(order.updated_at), 'PPP')})`}
                    </p>
                  </div>
                  <div className="space-x-2">
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => openUpdateDialog(order)}
                        >
                          Change Bed
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
