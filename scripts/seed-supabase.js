/*
Seed script for Supabase products table.
Usage: node scripts/seed-supabase.js
It reads Supabase URL / anon key from app.json (expo.extra) like test-supabase-connection.js

This script will upsert (insert or update) sample products.
*/
const { createClient } = require('@supabase/supabase-js');
const appJson = require('../app.json');

const supabaseUrl = appJson.expo.extra.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = appJson.expo.extra.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables in app.json');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  const categories = [
    { id: 1, name: 'Masques', description: 'Masques et rituels' },
    { id: 2, name: 'Textiles', description: 'Tissus et vêtements' },
    { id: 3, name: 'Sculptures', description: 'Bronze et bois sculpté' },
    { id: 4, name: 'Instruments', description: 'Instruments de musique' },
  ];

  const products = [
    {
      id: 1,
      name: 'Masque Dogon',
      origin: 'Mali - XIXe siècle',
      price_eur: 450,
      category_id: 1,
      image_url:
        'https://images.unsplash.com/photo-1523381211284-0f7f2e9b12b9?auto=format&fit=crop&w=800&q=80',
      description: 'Masque rituel traditionnel du peuple Dogon',
    },
    {
      id: 2,
      name: 'Tissu Kente',
      origin: 'Ghana - Artisanat',
      price_eur: 120,
      category_id: 2,
      image_url:
        'https://images.unsplash.com/photo-1542224566-3e8ea1a8f7c0?auto=format&fit=crop&w=800&q=80',
      description: 'Tissu Kente artisanal aux motifs colorés',
    },
    {
      id: 3,
      name: 'Sculpture Bronze',
      origin: 'Bénin - Art contemporain',
      price_eur: 890,
      category_id: 3,
      image_url:
        'https://images.unsplash.com/photo-1602524815535-e6c2b0c3d7d6?auto=format&fit=crop&w=800&q=80',
      description:
        'Sculpture en bronze moderne inspirée des traditions ouest-africaines',
    },
    {
      id: 4,
      name: 'Couronne Royale Ashanti',
      origin: 'Ghana - Patrimoine',
      price_eur: 1500,
      category_id: 3,
      image_url:
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      description: 'Couronne royale décorée de symboles traditionnels',
    },
    {
      id: 5,
      name: 'Tambour Djembé',
      origin: 'Mali - Instrument',
      price_eur: 250,
      category_id: 4,
      image_url:
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
      description:
        'Tambour traditionnel, parfait pour cérémonies et spectacles',
    },
  ];

  try {
    console.log('Upserting categories...');
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' });
    if (catError) {
      console.error('Categories seed failed:', catError.message || catError);
      process.exit(1);
    }
    const catCount = Array.isArray(catData) ? catData.length : 0;

    console.log('Upserting products...');
    const { data, error } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'id' });
    if (error) {
      console.error('Products seed failed:', error.message || error);
      process.exit(1);
    }
    const prodCount = Array.isArray(data) ? data.length : 0;
    console.log('Seed complete. Categories:', catCount, 'Products:', prodCount);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message || err);
    process.exit(1);
  }
}

seed();
