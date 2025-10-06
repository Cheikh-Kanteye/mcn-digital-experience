
-- Create categories table and add category_id FK to products

CREATE TABLE IF NOT EXISTS public.categories (
  id integer PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Add category_id column to products if not exists
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category_id integer;

-- Add foreign key constraint only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_category_id_fkey'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_category_id_fkey
      FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
  END IF;
END
$$;
