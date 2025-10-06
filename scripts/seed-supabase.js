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
    {
      id: 1,
      name: 'Livres',
      description: 'Ouvrages et essais sur les civilisations',
    },
    { id: 2, name: 'Éditions', description: 'Tirages et estampes artistiques' },
    {
      id: 3,
      name: 'Créations partenaires',
      description: "Objets et œuvres d'art fournis par nos partenaires",
    },
    {
      id: 4,
      name: 'Musique',
      description: 'Enregistrements et albums partenaires',
    },
  ];

  const products = [
    {
      id: 1,
      name: "Histoire des royaumes d'Afrique",
      origin: 'Édition partenaire',
      price_eur: 29.9,
      category_id: 1,
      image_url:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      description:
        'Un essai illustré sur les grandes civilisations africaines.',
    },
    {
      id: 2,
      name: 'Tirage - Masque traditionnel (50 ex.)',
      origin: 'Impression partenaire',
      price_eur: 75,
      category_id: 2,
      image_url:
        'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80',
      description:
        'Estampe en édition limitée imprimée par un atelier partenaire.',
    },
    {
      id: 3,
      name: "Série 'Racines' - Print d'artiste",
      origin: 'Création partenaire',
      price_eur: 120,
      category_id: 2,
      image_url:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      description:
        "Print d'artiste réalisé en collaboration avec un créateur contemporain.",
    },
    {
      id: 4,
      name: 'Album - Rythmes du Sahel',
      origin: 'Label partenaire',
      price_eur: 14.99,
      category_id: 4,
      image_url:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      description:
        "Compilation d'artistes contemporains influencés par les rythmes traditionnels.",
    },
    {
      id: 5,
      name: 'Affiche - Festival des Arts',
      origin: 'Atelier partenaire',
      price_eur: 25,
      category_id: 3,
      image_url:
        'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80',
      description:
        'Affiche officielle reproduite par nos partenaires du festival.',
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
