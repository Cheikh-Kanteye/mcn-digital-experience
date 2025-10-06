Seed & products setup

1. Create the `products` table in your Supabase project:

   - Open Supabase dashboard -> SQL editor and run the SQL in `supabase/migrations/20251006120000_create_products_table.sql`

2. Ensure `app.json` contains your Supabase keys under `expo.extra.EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

3. Run the seed script from project root:

```powershell
pnpm install
node scripts/seed-supabase.js
```

This will upsert a few demo products with Unsplash image links and a `price_eur` numeric field.

4. Start the app (Expo):

```powershell
pnpm dev
# or
expo start -c
```

The boutique screen will fetch products from the `products` table and display prices in the selected currency (EUR, USD, XOF).
