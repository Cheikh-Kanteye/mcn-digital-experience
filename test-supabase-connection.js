const { createClient } = require('@supabase/supabase-js');
const appJson = require('./app.json');

const supabaseUrl = appJson.expo.extra.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = appJson.expo.extra.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('collections')
      .select('count')
      .limit(1);
    if (error) {
      console.error('Connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log('Tables accessible:', data ? 'Yes' : 'No');

    // Test if tables exist
    const tables = ['collections', 'artworks', 'visitor_passport'];
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        if (tableError) {
          console.log(
            `❌ Table '${table}' not accessible:`,
            tableError.message
          );
        } else {
          console.log(`✅ Table '${table}' accessible`);
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }

    return true;
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    return false;
  }
}

testConnection();
