/**
 * Production catalog seeder for Quantum Bio Peptides.
 *
 * Usage (PowerShell):
 *   $env:STRAPI_URL="https://backhouseofpeptides-production.up.railway.app"
 *   $env:STRAPI_TOKEN="<full-access API token from Strapi admin>"
 *   node scripts/seed-catalog.js
 *
 * Idempotent: products whose slug already exists are skipped.
 */
const https = require('https');
const http = require('http');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('STRAPI_TOKEN env var is required. Create a full-access API token in Strapi admin -> Settings -> API Tokens.');
  process.exit(1);
}

const DISCLAIMER =
  'For laboratory research use only. Not for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Handling is restricted to qualified laboratory personnel. No dosing, administration, or reconstitution guidance is provided.';

// Note: the Product schema has no `category` field, so category is recorded
// here only as a code comment for reference and is not sent to Strapi.
const products = [
  {
    // Category: Metabolic Signaling
    name: 'Retatrutide',
    slug: 'retatrutide',
    badgeText: 'Triple-Receptor Research',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A synthetic triple-receptor agonist research compound studied for activity at GIP, GLP-1, and glucagon receptors.',
    description:
      'Retatrutide is an investigational synthetic peptide used in controlled laboratory research involving multi-receptor metabolic signaling. It is studied for its interactions with glucose-dependent insulinotropic polypeptide, glucagon-like peptide-1, and glucagon receptor pathways.\n\nThis material is supplied exclusively for analytical, biochemical, and preclinical laboratory research. It is not an approved drug and is not intended for human or veterinary use.',
    variants: [
      { name: '10 mg', sku: 'RET-10MG', price: 40.0 },
      { name: '20 mg', sku: 'RET-20MG', price: 70.0 },
    ],
  },
  {
    // Category: Metabolic Signaling
    name: 'Semaglutide',
    slug: 'semaglutide',
    badgeText: 'GLP-1 Research',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A synthetic GLP-1 receptor agonist reference material for laboratory investigation of incretin and metabolic signaling.',
    description:
      'Semaglutide is a synthetic peptide analog used in laboratory studies of glucagon-like peptide-1 receptor activity. Research applications may include receptor binding, incretin signaling, glucose-regulatory pathways, cellular response, and related metabolic mechanisms.\n\nThis research material is not represented as an approved pharmaceutical product and is not intended for human or veterinary use.',
    variants: [
      { name: '5 mg', sku: 'SEMA-5MG', price: 25.0 },
      { name: '10 mg', sku: 'SEMA-10MG', price: 40.0 },
    ],
  },
  {
    // Category: Mitochondrial Research
    name: 'MOTS-c',
    slug: 'mots-c',
    badgeText: 'Mitochondrial-Derived Peptide',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A mitochondrial-derived peptide studied in metabolic homeostasis, cellular stress, and mitochondrial signaling models.',
    description:
      'MOTS-c is a mitochondrial-derived peptide used in laboratory investigation of cellular energy regulation and mitochondrial-to-nuclear communication. Research areas include metabolic homeostasis, AMPK-associated signaling, oxidative stress response, glucose metabolism, and cellular adaptation.\n\nThe material is intended solely for controlled laboratory research and is not intended for human or veterinary use.',
    variants: [{ name: '10 mg', sku: 'MOTSC-10MG', price: 24.0 }],
  },
  {
    // Category: Metabolic Signaling
    name: 'AOD-9604',
    slug: 'aod-9604',
    badgeText: 'GH Fragment Research',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A synthetic modified fragment of human growth hormone studied in preclinical lipid-metabolism research.',
    description:
      'AOD-9604 is a synthetic peptide based on the C-terminal region of human growth hormone. It is used in laboratory research involving lipid metabolism, adipocyte biology, beta-adrenergic signaling, and the biological activity of growth-hormone-derived peptide fragments.\n\nThis product is intended exclusively for laboratory investigation and is not intended for human or veterinary use.',
    variants: [{ name: '5 mg', sku: 'AOD9604-5MG', price: 24.0 }],
  },
  {
    // Category: Growth Hormone Axis
    name: 'CJC-1295 No DAC',
    slug: 'cjc-1295-no-dac',
    badgeText: 'GHRH-Analog Research',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A short-acting GHRH-analog research material used to investigate growth-hormone-axis signaling.',
    description:
      'CJC-1295 No DAC is the commercial name commonly used for a short-acting growth-hormone-releasing-hormone analog. It is studied in laboratory models involving GHRH receptor activity, pituitary signaling, pulsatile growth hormone biology, and related endocrine pathways.\n\nProduct identity and sequence should be verified against the accompanying supplier documentation because naming conventions for "CJC-1295 No DAC" can vary between suppliers.',
    variants: [{ name: '10 mg', sku: 'CJC-NODAC-10MG', price: 45.0 }],
  },
  {
    // Category: Growth Hormone Axis
    name: 'CJC-1295 No DAC + Ipamorelin',
    slug: 'cjc-1295-no-dac-ipamorelin',
    badgeText: 'Dual-Peptide Blend',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A dual-compound research blend combining a short-acting GHRH analog with the selective growth hormone secretagogue ipamorelin.',
    description:
      'This laboratory blend combines CJC-1295 No DAC, a short-acting GHRH analog, with ipamorelin, a selective growth hormone secretagogue and ghrelin-receptor agonist. It is intended for research involving complementary GHRH and GHS receptor pathways, pituitary response, and growth-hormone-axis signaling.\n\nThis blend is supplied strictly for controlled laboratory research and is not intended for human or veterinary use.',
    variants: [
      { name: '10 mg total (CJC-1295 No DAC 5 mg + Ipamorelin 5 mg)', sku: 'CJC-IPA-5MG-5MG', price: 50.0 },
    ],
  },
  {
    // Category: Growth Hormone Axis
    name: 'Tesamorelin',
    slug: 'tesamorelin',
    badgeText: 'GHRF-Analog Research',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A synthetic growth-hormone-releasing-factor analog for laboratory research involving GHRH receptor and GH/IGF-1 signaling.',
    description:
      'Tesamorelin is a synthetic analog of growth-hormone-releasing factor. Laboratory research applications include GHRH receptor activity, pituitary signaling, growth hormone and IGF-1 pathway investigation, adipose-tissue biology, and endocrine response models.\n\nThis research material is not represented as a branded or approved pharmaceutical product and is not intended for human or veterinary use.',
    variants: [{ name: '20 mg', sku: 'TESA-20MG', price: 65.0 }],
  },
  {
    // Category: Research Blends — inactive until composition confirmed
    name: 'Wolverine Research Blend',
    slug: 'wolverine-blend',
    badgeText: 'Dual-Peptide Blend',
    requiresConfirmation: true,
    active: false,
    shortDescription:
      'A dual research blend of BPC-157 and TB-500 for laboratory study of cellular migration, cytoskeletal activity, and tissue-response pathways.',
    description:
      'The Wolverine Research Blend combines BPC-157 and TB-500 in a single laboratory formulation. It is intended for experimental investigation of cell migration, actin-associated processes, extracellular-matrix response, angiogenic signaling, and preclinical tissue-response models.\n\nThe exact quantity of each component must be listed from the supplier label or certificate of analysis before this product is activated.',
    variants: [
      { name: '20 mg total (BPC-157 + TB-500 — ratio to confirm)', sku: 'WOLV-20MG', price: 65.0, active: false },
    ],
  },
  {
    // Category: Research Blends — inactive until composition confirmed
    name: 'GLOW Research Blend',
    slug: 'glow-blend',
    badgeText: 'Multi-Peptide Blend',
    requiresConfirmation: true,
    active: false,
    shortDescription:
      'A multi-component research formulation for laboratory investigation of copper-peptide signaling and tissue-response pathways.',
    description:
      'GLOW is a multi-component laboratory blend intended for research involving extracellular-matrix biology, copper-peptide signaling, cell migration, collagen-associated pathways, angiogenic signaling, and experimental tissue-response models.\n\nBecause GLOW is a commercial blend name rather than a standardized scientific formulation, every ingredient and quantity must be confirmed from the supplier documentation before publication. Expected formulation requiring confirmation: GHK-Cu 50 mg + BPC-157 10 mg + TB-500 10 mg.',
    variants: [
      { name: '70 mg total (formulation to confirm)', sku: 'GLOW-70MG', price: 50.0, active: false },
    ],
  },
  {
    // Category: Research Blends — inactive until composition confirmed
    name: 'KLOW Research Blend',
    slug: 'klow-blend',
    badgeText: 'Four-Component Blend',
    requiresConfirmation: true,
    active: false,
    shortDescription:
      'A four-component research blend for laboratory investigation of peptide signaling, cellular migration, and inflammatory-response pathways.',
    description:
      'KLOW is a multi-component research formulation intended for advanced laboratory studies involving copper-peptide activity, extracellular-matrix response, cell migration, cytoskeletal signaling, and inflammation-associated pathways.\n\nKLOW is not a standardized scientific name. The ingredient identity and quantity of every component must be verified against the supplier label and certificate of analysis before this product is activated. Expected formulation requiring confirmation: GHK-Cu 50 mg + BPC-157 10 mg + TB-500 10 mg + KPV 10 mg.',
    variants: [
      { name: '80 mg total (formulation to confirm)', sku: 'KLOW-80MG', price: 64.0, active: false },
    ],
  },
  {
    // Category: Cellular Cofactors
    name: 'NAD+',
    slug: 'nad-plus',
    badgeText: 'Redox Cofactor',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'Oxidized nicotinamide adenine dinucleotide for laboratory research involving redox biology, energy metabolism, and cellular signaling.',
    description:
      'Nicotinamide adenine dinucleotide, or NAD+, is a central cellular coenzyme involved in oxidation-reduction reactions. It is used in laboratory studies involving cellular energy metabolism, mitochondrial activity, DNA-repair-associated enzymes, chromatin regulation, and stress-response pathways.\n\nNAD+ is a biochemical cofactor rather than a peptide. This material is intended exclusively for analytical and laboratory research and is not intended for human or veterinary use.',
    variants: [
      { name: '500 mg', sku: 'NAD-500MG', price: 30.0 },
      { name: '1000 mg', sku: 'NAD-1000MG', price: 40.0 },
    ],
  },
  {
    // Category: Growth Hormone Axis
    name: 'Hexarelin',
    slug: 'hexarelin',
    badgeText: 'GHRP Research',
    requiresConfirmation: true,
    active: true,
    shortDescription:
      'A synthetic growth-hormone-releasing peptide studied for growth hormone secretagogue and ghrelin-receptor activity.',
    description:
      'Hexarelin is a synthetic growth-hormone-releasing peptide used in laboratory research involving growth hormone secretagogue receptors, pituitary and hypothalamic signaling, endocrine response, and GH-axis activity.\n\nThis product is supplied solely for controlled analytical and preclinical laboratory research and is not intended for human or veterinary use.',
    variants: [{ name: '5 mg', sku: 'HEX-5MG', price: 30.0 }],
  },
];

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
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response (${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function productExists(slug) {
  const res = await makeRequest('GET', `/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}`);
  return Array.isArray(res.data) && res.data.length > 0;
}

async function seed() {
  console.log(`Seeding catalog to ${STRAPI_URL}\n`);
  let created = 0;
  let skipped = 0;

  for (const productData of products) {
    const { variants, ...productFields } = productData;

    try {
      if (await productExists(productFields.slug)) {
        console.log(`- Skipping "${productFields.name}" (slug "${productFields.slug}" already exists)`);
        skipped++;
        continue;
      }

      console.log(`Creating product: ${productFields.name}`);
      const productResponse = await makeRequest('POST', '/api/products', { data: productFields });
      const productId = productResponse.data.id;
      console.log(`  created product id ${productId}`);

      for (const variant of variants) {
        await makeRequest('POST', '/api/variants', {
          data: {
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            active: variant.active ?? true,
            inventory: variant.inventory ?? null,
            product: productId,
          },
        });
        console.log(`  variant ${variant.sku} -> ${variant.price}`);
      }
      created++;
      console.log('');
    } catch (error) {
      console.error(`  ERROR creating ${productFields.name}: ${error.message}`);
    }
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`);
  console.log('Reminder: blends (Wolverine, GLOW, KLOW) were created inactive until composition is confirmed.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
