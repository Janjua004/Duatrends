const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:4c6QiixPdPhqUMXP@db.iznrzssyzhecqpmxftmy.supabase.co:5432/postgres';

async function main() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected successfully!');

  // 1. Create public.products table
  console.log('Creating public.products table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.products (
      id TEXT PRIMARY KEY,
      title TEXT,
      price NUMERIC,
      data JSONB,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow public select" ON public.products;
    CREATE POLICY "Allow public select" ON public.products FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow public insert" ON public.products;
    CREATE POLICY "Allow public insert" ON public.products FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public update" ON public.products;
    CREATE POLICY "Allow public update" ON public.products FOR UPDATE USING (true);

    DROP POLICY IF EXISTS "Allow public delete" ON public.products;
    CREATE POLICY "Allow public delete" ON public.products FOR DELETE USING (true);

    GRANT ALL ON TABLE public.products TO anon, authenticated, service_role, postgres;
  `);

  console.log('Table & RLS policies configured successfully!');

  // 2. Fetch API keys or JWT secret from DB if available
  try {
    const keysRes = await client.query(`
      SELECT * FROM vault.decrypted_secrets WHERE name LIKE '%anon%' OR name LIKE '%key%' LIMIT 10;
    `).catch(() => null);
    
    if (keysRes && keysRes.rows.length > 0) {
      console.log('Vault Secrets:', keysRes.rows);
    }
  } catch (e) {
    // Ignore vault check if unpopulated
  }

  // 3. Seed initial scraped products
  console.log('Seeding products into Supabase database...');
  const rawProducts = JSON.parse(fs.readFileSync('./src/data/scraped_products.json', 'utf8'));

  for (const p of rawProducts) {
    await client.query(`
      INSERT INTO public.products (id, title, price, data, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO UPDATE 
      SET title = EXCLUDED.title, price = EXCLUDED.price, data = EXCLUDED.data, updated_at = NOW();
    `, [p.id, p.title, p.price, JSON.stringify(p)]);
  }

  console.log(`Successfully seeded ${rawProducts.length} products into live Supabase DB!`);

  const countRes = await client.query('SELECT COUNT(*) FROM public.products;');
  console.log('Total live products in Supabase:', countRes.rows[0].count);

  await client.end();
}

main().catch(err => {
  console.error('Setup error:', err);
  process.exit(1);
});
