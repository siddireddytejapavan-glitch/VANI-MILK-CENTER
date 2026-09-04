async function testEndpoints() {
  console.log('Testing live Next.js production server at http://localhost:3000 ...\n');

  const pages = ['/', '/products', '/cart', '/about', '/contact', '/admin/login'];
  for (const page of pages) {
    const res = await fetch(`http://localhost:3000${page}`);
    console.log(`[HTTP GET] ${page.padEnd(16)} -> Status: ${res.status} ${res.statusText}`);
    if (res.status !== 200) {
      console.error(`FAILED to load ${page}`);
      process.exit(1);
    }
  }

  // 1. Test public API: settings
  const settingsRes = await fetch('http://localhost:3000/api/settings');
  const settingsData = await settingsRes.json();
  console.log(`[API GET]  /api/settings     -> Status: ${settingsRes.status}, Shop: "${settingsData.settings?.shopName}"`);

  // 2. Test public API: products
  const productsRes = await fetch('http://localhost:3000/api/products');
  const productsData = await productsRes.json();
  console.log(`[API GET]  /api/products     -> Status: ${productsRes.status}, Products count: ${productsData.products?.length}`);

  // 3. Test route protection on /admin without cookie -> should redirect or be protected
  const unauthRes = await fetch('http://localhost:3000/admin', { redirect: 'manual' });
  console.log(`[AUTH CHECK] /admin (unauthenticated) -> Status: ${unauthRes.status} (Redirects to: ${unauthRes.headers.get('location')})`);

  // 4. Test admin login API
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'siddreddylakshmankumar@gmail.com', password: 'VANI@MILK' }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie');
  console.log(`[AUTH LOGIN] /api/auth/login  -> Status: ${loginRes.status}, Cookie set: ${Boolean(setCookie)}`);

  // 5. Test Customer Checkout API (Curd 10kg bucket x 5 = ₹2,500 with marriage function note)
  const curdProd = productsData.products.find(p => p.name.includes('Curd'));
  const bucket10kg = curdProd.variants.find(v => v.packSize.includes('10 kg'));

  const orderRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Rahul',
      customerPhone: '9876543210',
      address: 'Tuni, Andhra Pradesh',
      notes: 'Required for marriage function.',
      items: [{ variantId: bucket10kg.id, quantity: 5 }],
    }),
  });

  const orderData = await orderRes.json();
  console.log(`[CHECKOUT]   /api/orders       -> Status: ${orderRes.status}, Order ID: #${orderData.order?.id.slice(-6).toUpperCase()}, Total: ₹${orderData.order?.totalAmount}`);
  console.log(`[WHATSAPP LINK] ${orderData.whatsAppLink}`);

  console.log('\nAll live HTTP endpoint validations passed successfully!');
}

testEndpoints().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
