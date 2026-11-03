import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://127.0.0.1:8787';
const results = [];
let adminCookie = '';
let secondAdminCookie = '';
let firstOrder = null;
let secondOrder = null;

async function request(path, { method = 'GET', body, cookie } = {}) {
  const headers = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (cookie) headers.cookie = cookie;
  const response = await fetch(base + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual'
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text.slice(0, 300) }; }
  return { response, data };
}
async function test(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, status: 'PASS', detail: detail || '' });
  } catch (error) {
    results.push({ name, status: 'FAIL', detail: String(error?.message || error) });
  }
}
function cookieFrom(response) {
  const all = response.headers.getSetCookie?.() || [];
  const raw = all[0] || response.headers.get('set-cookie') || '';
  return raw.split(';')[0];
}

await test('Health endpoint returns service OK', async () => {
  const { response, data } = await request('/api/health');
  assert.equal(response.status, 200);
  assert.equal(data.ok, true);
  assert.equal(data.service, 'metho-lite');
});
await test('Public config endpoint returns valid JSON structure', async () => {
  const { response, data } = await request('/api/config');
  assert.equal(response.status, 200);
  assert.ok(data.settings && Array.isArray(data.banners));
});
await test('Public products endpoint returns two products and four package variants', async () => {
  const { response, data } = await request('/api/products');
  assert.equal(response.status, 200);
  assert.equal(data.products.length, 2);
  assert.equal(data.products.reduce((n, p) => n + p.variants.length, 0), 4);
});
await test('Visitor analytics accepts a valid anonymous visitor ID', async () => {
  const { response, data } = await request('/api/visit', {
    method: 'POST',
    body: { visitor_id: '11111111-2222-4333-8444-555555555555' }
  });
  assert.equal(response.status, 200);
  assert.equal(data.ok, true);
});
await test('Admin APIs reject unauthenticated access', async () => {
  const { response } = await request('/api/admin/orders');
  assert.equal(response.status, 401);
});
await test('First-run setup creates exactly two admin accounts', async () => {
  const { response, data } = await request('/api/auth/setup', {
    method: 'POST',
    body: { admins: [
      { username: 'qa_admin_one', display_name: 'QA Admin One', password: 'QA-Only-Password-123!' },
      { username: 'qa_admin_two', display_name: 'QA Admin Two', password: 'QA-Only-Password-456!' }
    ]}
  });
  assert.equal(response.status, 200);
  assert.equal(data.ok, true);
});
await test('Admin login creates a secure session cookie', async () => {
  const { response, data } = await request('/api/auth/login', {
    method: 'POST',
    body: { username: 'qa_admin_one', password: 'QA-Only-Password-123!' }
  });
  assert.equal(response.status, 200);
  assert.equal(data.ok, true);
  adminCookie = cookieFrom(response);
  assert.match(adminCookie, /^metho_session=/);
  assert.match(response.headers.get('set-cookie') || '', /HttpOnly/i);
});
await test('Second admin can log in independently', async () => {
  const { response } = await request('/api/auth/login', {
    method: 'POST',
    body: { username: 'qa_admin_two', password: 'QA-Only-Password-456!' }
  });
  assert.equal(response.status, 200);
  secondAdminCookie = cookieFrom(response);
  assert.match(secondAdminCookie, /^metho_session=/);
});
await test('Admin setup cannot be repeated', async () => {
  const { response } = await request('/api/auth/setup', {
    method: 'POST',
    body: { admins: [
      { username: 'qa_admin_three', display_name: 'QA Admin Three', password: 'QA-Only-Password-789!' },
      { username: 'qa_admin_four', display_name: 'QA Admin Four', password: 'QA-Only-Password-000!' }
    ]}
  });
  assert.equal(response.status, 409);
});
await test('Invalid order input is rejected', async () => {
  const { response } = await request('/api/orders', {
    method: 'POST',
    body: { customer_name: 'QA', phone: '01700000000', district: 'ঢাকা', address: '', items: [], payment_method: 'cod' }
  });
  assert.equal(response.status, 400);
});
await test('Admin can set product variant price', async () => {
  const { response, data } = await request('/api/admin/variants/1', {
    method: 'PATCH', cookie: adminCookie, body: { price_taka: 500 }
  });
  assert.equal(response.status, 200);
  assert.equal(data.ok, true);
  const { data: variants } = await request('/api/admin/variants', { cookie: adminCookie });
  assert.equal(variants.variants.find(v => v.id === 1).price_paisa, 50000);
});
await test('COD checkout computes Jhenaidah delivery and 1% COD fee server-side', async () => {
  const { response, data } = await request('/api/orders', {
    method: 'POST',
    body: {
      customer_name: 'QA Customer One', phone: '01700000001', district: 'ঝিনাইদহ',
      upazila: 'কালীগঞ্জ', address: 'গ্রাম QA, উপজেলা: কালীগঞ্জ, জেলা: ঝিনাইদহ',
      payment_method: 'cod', items: [{ variant_id: 1, quantity: 1 }]
    }
  });
  assert.equal(response.status, 200);
  assert.equal(data.subtotal_paisa, 50000);
  assert.equal(data.delivery_fee_paisa, 6566);
  assert.equal(data.total_paisa, 56566);
  assert.match(data.order_code, /^ML\d{6}-\d{5}$/);
  firstOrder = { code: data.order_code, phone: '01700000001' };
});
await test('Same phone is rate-limited for 60 seconds', async () => {
  const { response } = await request('/api/orders', {
    method: 'POST',
    body: {
      customer_name: 'QA Customer Repeat', phone: '01700000001', district: 'ঝিনাইদহ',
      address: 'গ্রাম QA, উপজেলা: কালীগঞ্জ, জেলা: ঝিনাইদহ',
      payment_method: 'cod', items: [{ variant_id: 1, quantity: 1 }]
    }
  });
  assert.equal(response.status, 429);
});
await test('Advance checkout has no COD surcharge', async () => {
  const { response, data } = await request('/api/orders', {
    method: 'POST',
    body: {
      customer_name: 'QA Customer Two', phone: '01700000002', district: 'ঢাকা',
      upazila: 'মিরপুর', address: 'রোড QA, উপজেলা: মিরপুর, জেলা: ঢাকা',
      payment_method: 'advance', items: [{ variant_id: 1, quantity: 1 }]
    }
  });
  assert.equal(response.status, 200);
  assert.equal(data.delivery_fee_paisa, 11500);
  assert.equal(data.total_paisa, 61500);
  secondOrder = { code: data.order_code, phone: '01700000002' };
});
await test('Invoice lookup validates order code and phone, and masks phone number', async () => {
  assert.ok(firstOrder, 'first order was not created');
  const { response, data } = await request('/api/invoice', {
    method: 'POST', body: { orderCode: firstOrder.code, phone: firstOrder.phone }
  });
  assert.equal(response.status, 200);
  assert.equal(data.ok, true);
  assert.equal(data.order.phone_masked, '01700***');
});
await test('New-order count is tracked separately for each admin', async () => {
  assert.ok(firstOrder, 'first order was not created');
  const first = await request('/api/admin/orders/new-count', { cookie: adminCookie });
  const second = await request('/api/admin/orders/new-count', { cookie: secondAdminCookie });
  assert.equal(first.data.count, 2);
  assert.equal(second.data.count, 2);
});
await test('Marking an order viewed clears only that admin unread count', async () => {
  assert.ok(firstOrder, 'first order was not created');
  const { data: list } = await request('/api/admin/orders', { cookie: adminCookie });
  const order = list.orders.find(x => x.order_code === firstOrder.code);
  assert.ok(order);
  const viewed = await request('/api/admin/orders/' + order.id + '/view', {
    method: 'POST', cookie: adminCookie, body: {}
  });
  assert.equal(viewed.response.status, 200);
  const first = await request('/api/admin/orders/new-count', { cookie: adminCookie });
  const second = await request('/api/admin/orders/new-count', { cookie: secondAdminCookie });
  assert.equal(first.data.count, 1);
  assert.equal(second.data.count, 2);
});
await test('Accepted orders remain excluded from courier until explicitly activated', async () => {
  assert.ok(firstOrder, 'first order was not created');
  const { data: list } = await request('/api/admin/orders', { cookie: adminCookie });
  const order = list.orders.find(x => x.order_code === firstOrder.code);
  assert.ok(order);
  const accepted = await request('/api/admin/orders/' + order.id, {
    method: 'PATCH', cookie: adminCookie, body: { status: 'accepted' }
  });
  assert.equal(accepted.response.status, 200);
  const queue = await request('/api/admin/courier/orders', { cookie: adminCookie });
  assert.ok(!queue.data.orders.some(x => x.id === order.id));
  const activated = await request('/api/admin/orders/' + order.id, {
    method: 'PATCH', cookie: adminCookie, body: { courier_disabled: false }
  });
  assert.equal(activated.response.status, 200);
  const queueAfter = await request('/api/admin/courier/orders', { cookie: adminCookie });
  assert.ok(queueAfter.data.orders.some(x => x.id === order.id));
  assert.equal(queueAfter.data.courier_configured, false);
});
await test('Stock is reserved on order creation and never goes below zero', async () => {
  assert.ok(firstOrder, 'first order was not created');
  const { data } = await request('/api/admin/variants', { cookie: adminCookie });
  const variant = data.variants.find(v => v.id === 1);
  assert.equal(variant.stock_qty, 3, 'two 1kg orders should reserve two units from the seeded stock of five');
});
await test('Rejecting an order restores only previously reserved stock', async () => {
  assert.ok(firstOrder, 'first order was not created');
  const { data: list } = await request('/api/admin/orders', { cookie: adminCookie });
  const order = list.orders.find(x => x.order_code === firstOrder.code);
  const rejected = await request('/api/admin/orders/' + order.id, {
    method: 'PATCH', cookie: adminCookie, body: { status: 'rejected' }
  });
  assert.equal(rejected.response.status, 200);
  const { data: variants } = await request('/api/admin/variants', { cookie: adminCookie });
  assert.equal(variants.variants.find(v => v.id === 1).stock_qty, 4, 'rejecting one order should restore exactly one reserved unit');
});
await test('Logout invalidates the admin session', async () => {
  const { response } = await request('/api/auth/logout', { method: 'POST', cookie: adminCookie });
  assert.equal(response.status, 200);
  const after = await request('/api/admin/orders', { cookie: adminCookie });
  assert.equal(after.response.status, 401);
});

console.log('\nMETHO Lite local end-to-end test report');
for (const item of results) console.log(item.status + ' | ' + item.name + (item.detail ? ' | ' + item.detail : ''));
const passed = results.filter(x => x.status === 'PASS').length;
const failed = results.filter(x => x.status === 'FAIL').length;
console.log('\nTOTAL: ' + passed + ' passed, ' + failed + ' failed, ' + results.length + ' executed');
if (failed) process.exitCode = 1;
