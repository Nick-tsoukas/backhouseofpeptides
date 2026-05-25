const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Strapi API configuration
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = 'b5a90d3392bc30881ecbe81c24d6214870dc0120714d0a0266a9e136c95564c95fcb85c9fc609a556f700900259463569e04a1308401f0deddf8b05b48c664db0db987e2a08b9e290ff8de85c89d86a7e7929e709905c9252920e3a7009316f4f488e1e6473ca3973d689258f76165e0b01a71a6431dee460881ed88511fc4c8';

// Unsplash image URL (direct download link)
const IMAGE_URL = 'https://images.unsplash.com/photo-1631390573032-e6a9a4b5e704?w=800&q=80';

const products = [
  {
    name: 'BPC-157',
    slug: 'bpc-157',
    shortDescription: 'Body Protection Compound-157, a synthetic peptide for research applications.',
    description: 'BPC-157 is a synthetic peptide that has been the subject of numerous research studies. It consists of 15 amino acids and is a partial sequence of body protection compound (BPC) found in human gastric juice. This product is intended for research purposes only.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '5mg', sku: 'BPC157-5MG', price: 39.99, inventory: 100 },
      { name: '10mg', sku: 'BPC157-10MG', price: 69.99, inventory: 50 },
    ],
  },
  {
    name: 'TB-500',
    slug: 'tb-500',
    shortDescription: 'Thymosin Beta-4 fragment for laboratory research.',
    description: 'TB-500 is a synthetic fraction of the protein thymosin beta-4, which is present in virtually all human and animal cells. This peptide has been extensively studied in research settings. For research use only.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '2mg', sku: 'TB500-2MG', price: 29.99, inventory: 75 },
      { name: '5mg', sku: 'TB500-5MG', price: 59.99, inventory: 60 },
      { name: '10mg', sku: 'TB500-10MG', price: 99.99, inventory: 30 },
    ],
  },
  {
    name: 'Ipamorelin',
    slug: 'ipamorelin',
    shortDescription: 'Growth hormone secretagogue peptide for research.',
    description: 'Ipamorelin is a pentapeptide and growth hormone secretagogue. It has been studied for its selective stimulation of growth hormone release. This product is strictly for laboratory research purposes.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '2mg', sku: 'IPA-2MG', price: 24.99, inventory: 120 },
      { name: '5mg', sku: 'IPA-5MG', price: 49.99, inventory: 80 },
    ],
  },
  {
    name: 'CJC-1295',
    slug: 'cjc-1295',
    shortDescription: 'Modified growth hormone releasing hormone analog.',
    description: 'CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH). It has been modified to increase its half-life and stability. For research applications only.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '2mg', sku: 'CJC-2MG', price: 34.99, inventory: 90 },
      { name: '5mg', sku: 'CJC-5MG', price: 74.99, inventory: 45 },
    ],
  },
  {
    name: 'Melanotan II',
    slug: 'melanotan-ii',
    shortDescription: 'Synthetic analog of alpha-melanocyte stimulating hormone.',
    description: 'Melanotan II is a synthetic analog of the peptide hormone alpha-melanocyte stimulating hormone (α-MSH). It has been studied in various research contexts. Strictly for research purposes.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '10mg', sku: 'MT2-10MG', price: 44.99, inventory: 55 },
    ],
  },
  {
    name: 'Sermorelin',
    slug: 'sermorelin',
    shortDescription: 'Growth hormone-releasing hormone (GHRH) analog.',
    description: 'Sermorelin is a synthetic version of a naturally occurring substance that causes the release of growth hormone from the pituitary gland. For laboratory research only.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '2mg', sku: 'SERM-2MG', price: 29.99, inventory: 70 },
      { name: '5mg', sku: 'SERM-5MG', price: 59.99, inventory: 40 },
    ],
  },
  {
    name: 'GHK-Cu',
    slug: 'ghk-cu',
    shortDescription: 'Copper peptide complex for research applications.',
    description: 'GHK-Cu is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. It has been the subject of extensive research. For research use only.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '50mg', sku: 'GHKCU-50MG', price: 54.99, inventory: 65 },
      { name: '100mg', sku: 'GHKCU-100MG', price: 89.99, inventory: 35 },
    ],
  },
  {
    name: 'Epithalon',
    slug: 'epithalon',
    shortDescription: 'Synthetic tetrapeptide for telomere research.',
    description: 'Epithalon (Epitalon) is a synthetic version of the polypeptide Epithalamin. It has been studied in the context of telomere and aging research. For research purposes only.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '10mg', sku: 'EPITH-10MG', price: 39.99, inventory: 85 },
      { name: '50mg', sku: 'EPITH-50MG', price: 149.99, inventory: 25 },
    ],
  },
];

async function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, STRAPI_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function seed() {
  console.log('🌱 Starting seed process...\n');

  for (const productData of products) {
    const { variants, ...productFields } = productData;

    try {
      // Create product
      console.log(`Creating product: ${productFields.name}`);
      const productResponse = await makeRequest('POST', '/api/products', {
        data: productFields,
      });
      const productId = productResponse.data.id;
      console.log(`  ✓ Created product with ID: ${productId}`);

      // Create variants for this product
      for (const variant of variants) {
        console.log(`  Creating variant: ${variant.name}`);
        await makeRequest('POST', '/api/variants', {
          data: {
            ...variant,
            active: true,
            product: productId,
          },
        });
        console.log(`    ✓ Created variant: ${variant.name} (${variant.sku})`);
      }

      console.log('');
    } catch (error) {
      console.error(`  ✗ Error creating ${productFields.name}:`, error.message);
    }
  }

  console.log('✅ Seed process complete!');
}

seed().catch(console.error);
