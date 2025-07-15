-- Create the decks table
CREATE TABLE IF NOT EXISTS public.decks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    file_path TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own decks" ON public.decks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decks" ON public.decks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create the ankidecks storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('ankidecks', 'ankidecks', false);

-- Create storage policies
CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (bucket_id = 'ankidecks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'ankidecks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (bucket_id = 'ankidecks' AND auth.uid()::text = (storage.foldername(name))[1]);