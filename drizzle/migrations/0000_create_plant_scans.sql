CREATE TABLE public.plant_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  image_url text,
  disease_name text NOT NULL DEFAULT 'Unknown',
  plant_name text,
  severity text CHECK (severity IN ('Low', 'Medium', 'High')),
  confidence integer CHECK (confidence BETWEEN 0 AND 100),
  treatment_advice text,
  prevention_advice text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_plant_scans_user ON public.plant_scans (user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.plant_scans TO authenticated;
GRANT ALL ON public.plant_scans TO service_role;

ALTER TABLE public.plant_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans"
  ON public.plant_scans FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own scans"
  ON public.plant_scans FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own scans"
  ON public.plant_scans FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own scans"
  ON public.plant_scans FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Storage RLS: each farmer can read and upload only inside their own folder
CREATE POLICY "Users can upload own plant images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'plant-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read own plant images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'plant-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own plant images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'plant-images' AND (storage.foldername(name))[1] = auth.uid()::text);