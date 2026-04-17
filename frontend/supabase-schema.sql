-- ZimVerify Supabase Schema
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'public' CHECK (role IN ('public', 'police', 'government', 'insurance', 'partner', 'customs')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  registration TEXT,
  owner_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Customs entries
CREATE TABLE IF NOT EXISTS customs_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number TEXT NOT NULL UNIQUE,
  vin TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  port_of_entry TEXT NOT NULL,
  country_of_origin TEXT,
  importer_name TEXT,
  importer_id TEXT,
  registration TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Verification logs
CREATE TABLE IF NOT EXISTS verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  search_type TEXT NOT NULL,
  search_query TEXT NOT NULL,
  result_found BOOLEAN NOT NULL DEFAULT false,
  result_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Police cases
CREATE TABLE IF NOT EXISTS police_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Clear',
  event TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration);
CREATE INDEX IF NOT EXISTS idx_customs_entries_vin ON customs_entries(vin);
CREATE INDEX IF NOT EXISTS idx_customs_entries_entry_number ON customs_entries(entry_number);
CREATE INDEX IF NOT EXISTS idx_verification_logs_user ON verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_police_cases_plate ON police_cases(plate);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 7. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customs_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE police_cases ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies - Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 9. RLS Policies - Vehicles (readable by all authenticated users)
CREATE POLICY "Authenticated users can view vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customs can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('customs', 'government'))
  );

-- 10. RLS Policies - Customs Entries
CREATE POLICY "Customs and government can view entries"
  ON customs_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customs can insert entries"
  ON customs_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('customs', 'government'))
  );

-- 11. RLS Policies - Verification Logs
CREATE POLICY "Users can view own logs"
  ON verification_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create logs"
  ON verification_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 12. RLS Policies - Police Cases
CREATE POLICY "Police and government can view cases"
  ON police_cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('police', 'government'))
  );

CREATE POLICY "Police can insert cases"
  ON police_cases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'police')
  );

CREATE POLICY "Police can update cases"
  ON police_cases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'police')
  );

-- 13. Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'public')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 14. Seed some vehicle data
INSERT INTO vehicles (vin, make, model, year, color, registration, owner_name, status)
VALUES
  ('JTNB11HK0J3012345', 'Toyota', 'Hilux', 2024, 'White', 'HRE 4421 ZW', 'John Moyo', 'active'),
  ('MHFVC41F9JJ123456', 'Honda', 'Fit', 2023, 'Silver', 'BYO 7789 ZW', 'Sarah Ncube', 'active'),
  ('3GCPYBEK0JG654321', 'Ford', 'Ranger', 2024, 'Blue', 'GWE 1102 ZW', 'Peter Mutasa', 'active'),
  ('WBADT43452G123456', 'BMW', '3 Series', 2020, 'Black', 'HRE 8812 ZW', 'Grace Dube', 'stolen'),
  ('SALGS2EF8FA987654', 'Land Rover', 'Range Rover', 2019, 'Grey', 'BYO 4456 ZW', 'Michael Sithole', 'stolen')
ON CONFLICT (vin) DO NOTHING;

-- 15. Seed customs entries
INSERT INTO customs_entries (entry_number, vin, make, model, year, color, port_of_entry, country_of_origin, importer_name, importer_id, registration, status)
VALUES
  ('CE-2026-001234', 'JTNB11HK0J3012345', 'Toyota', 'Hilux', 2024, 'White', 'Beitbridge', 'Japan', 'John Moyo', 'ID-12345', 'HRE 4421 ZW', 'Processed'),
  ('CE-2026-001233', 'MHFVC41F9JJ123456', 'Honda', 'Fit', 2023, 'Silver', 'Harare Airport', 'Japan', 'Sarah Ncube', 'ID-67890', 'BYO 7789 ZW', 'Processed'),
  ('CE-2026-001232', '3GCPYBEK0JG654321', 'Ford', 'Ranger', 2024, 'Blue', 'Chirundu', 'South Africa', 'Peter Mutasa', 'ID-11223', 'GWE 1102 ZW', 'Review')
ON CONFLICT (entry_number) DO NOTHING;
