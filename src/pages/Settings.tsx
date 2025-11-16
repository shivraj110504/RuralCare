
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, KeyRound, ShieldAlert, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const resetEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ResetEmailValues = z.infer<typeof resetEmailSchema>;

const Settings = () => {
  const { currentUser, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetEmailForm = useForm<ResetEmailValues>({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Pre-fill email if available
    if (currentUser.email) {
      resetEmailForm.setValue("email", currentUser.email);
    }
  }, [currentUser, navigate, resetEmailForm]);

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);
    try {
      // First authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser?.email || "",
        password: values.currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Then update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (updateError) throw updateError;
      
      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error updating password:", error.message);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordEmail = async () => {
    if (!currentUser?.email) return;
    
    setIsLoading(true);
    try {
      await resetPassword(currentUser.email);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // First delete the user's data from all tables
      // This is just a placeholder - in a real app, you'd delete from all tables that have user data
      const { error: medicalDeleteError } = await supabase
        .from("medical_details")
        .delete()
        .eq("user_id", currentUser.id);
      
      if (medicalDeleteError) throw medicalDeleteError;
      
      // Finally, delete the user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        currentUser.id
      );
      
      if (deleteError) {
        // If admin delete fails, fallback to normal signout
        // Note: This doesn't actually delete the account, just signs them out
        await supabase.auth.signOut();
        throw new Error("Could not delete account. Please contact support.");
      }
      
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error.message);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-900 mb-8">Account Settings</h1>
          
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password or request a password reset email.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between items-center pt-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleResetPasswordEmail}
                          disabled={isLoading}
                        >
                          Send Reset Email
                        </Button>
                        
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Manage your account settings and data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-lg font-medium">Account Email</h3>
                      <p className="text-sm text-gray-500">
                        Your current email address is <span className="font-semibold">{currentUser.email}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-destructive/10 bg-destructive/5 p-4">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-lg font-medium flex items-center">
                        <ShieldAlert className="mr-2 h-5 w-5 text-destructive" />
                        Danger Zone
                      </h3>
                      <p className="text-sm text-gray-500">
                        This action will permanently delete your account and all associated data.
                      </p>
                      
                      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="mt-2 w-full sm:w-auto">
                            Delete Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove all of your data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex justify-between sm:justify-between">
                            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleDeleteAccount}
                              disabled={isLoading}
                            >
                              {isLoading ? "Deleting..." : "Delete Account"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate("/profile")}
                  >
                    Back to Profile
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
