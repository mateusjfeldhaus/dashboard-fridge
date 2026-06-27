-- Run this in your Neon SQL editor to set up the database

CREATE TABLE IF NOT EXISTS items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('carne', 'frango', 'porco', 'peixe', 'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro')),
  quantity    NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit        TEXT NOT NULL DEFAULT 'un',
  notes       TEXT,
  expiry_date DATE,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
