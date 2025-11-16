-- Create medical_details table for storing user medical information
CREATE TABLE public.medical_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  blood_type TEXT,
  height TEXT,
  weight TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  medications TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.medical_details ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own medical details" 
ON public.medical_details 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical details" 
ON public.medical_details 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical details" 
ON public.medical_details 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical details" 
ON public.medical_details 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_medical_details_updated_at
BEFORE UPDATE ON public.medical_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();