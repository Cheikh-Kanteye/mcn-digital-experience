const { createClient } = require('@supabase/supabase-js');
const appJson = require('../app.json');

const supabaseUrl = appJson.expo.extra.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = appJson.expo.extra.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables in app.json');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    const { data: cat, error: catErr } = await supabase
      .from('categories')
      .select('*')
      .limit(10);
    if (catErr) console.error('categories error:', catErr.message || catErr);
    else
      console.log(
        'categories rows:',
        Array.isArray(cat) ? cat.length : 0,
        JSON.stringify(cat, null, 2)
      );

    const { data: prod, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .limit(10);
    if (prodErr) console.error('products error:', prodErr.message || prodErr);
    else
      console.log(
        'products rows:',
        Array.isArray(prod) ? prod.length : 0,
        JSON.stringify(prod, null, 2)
      );
  } catch (err) {
    console.error('check error:', err.message || err);
  }
}

check();
