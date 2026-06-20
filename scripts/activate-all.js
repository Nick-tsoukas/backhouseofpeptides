/**
 * Activates every product and variant (sets active = true).
 * Usage:
 *   $env:STRAPI_URL="https://..."; $env:STRAPI_TOKEN="<token>"; node scripts/activate-all.js
 */
const https = require('https');
const http = require('http');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('STRAPI_TOKEN env var is required.');
  process.exit(1);
}

function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, STRAPI_URL);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    };
    const req = lib.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
        } catch (e) {
          reject(new Error(`Parse error (${res.statusCode}): ${body}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function activate() {
  console.log(`Activating all products & variants on ${STRAPI_URL}\n`);

  const products = await makeRequest('GET', '/api/products?pagination[pageSize]=200');
  for (const p of products.data) {
    if (!p.attributes.active) {
      await makeRequest('PUT', `/api/products/${p.id}`, { data: { active: true } });
      console.log(`product ${p.id} (${p.attributes.name}) -> active`);
    }
  }

  const variants = await makeRequest('GET', '/api/variants?pagination[pageSize]=500');
  for (const v of variants.data) {
    if (!v.attributes.active) {
      await makeRequest('PUT', `/api/variants/${v.id}`, { data: { active: true } });
      console.log(`variant ${v.id} (${v.attributes.sku}) -> active`);
    }
  }

  console.log('\nDone. All products and variants are active.');
}

activate().catch((e) => {
  console.error(e);
  process.exit(1);
});
