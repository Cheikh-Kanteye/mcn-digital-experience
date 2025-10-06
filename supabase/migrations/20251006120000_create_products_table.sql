-- Migration to create products table for demo/seeding
-- Run in your Supabase SQL editor or via migration tooling

create table if not exists public.products (
  id integer primary key,
  name text,
  origin text,
  description text,
  price_eur numeric,
  image_url text,
  created_at timestamptz default now()
);
