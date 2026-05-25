'use strict';

/**
 * Seed data for House of Peptides
 * Run this after Strapi starts to populate initial products
 * 
 * Usage: After starting Strapi, go to Content Manager and create entries manually,
 * or use the Strapi API to seed data programmatically.
 */

const sampleProducts = [
  {
    name: 'BPC-157',
    slug: 'bpc-157',
    shortDescription: 'Body Protection Compound-157, a synthetic peptide for research applications.',
    description: 'BPC-157 is a synthetic peptide that has been the subject of numerous research studies. It consists of 15 amino acids and is a partial sequence of body protection compound (BPC) found in human gastric juice. This product is intended for research purposes only.',
    active: true,
    requiresConfirmation: true,
    badgeText: 'Research Use Only',
    variants: [
      { name: '5mg', sku: 'BPC157-5MG', price: 39.99, active: true },
      { name: '10mg', sku: 'BPC157-10MG', price: 69.99, active: true },
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
      { name: '2mg', sku: 'TB500-2MG', price: 29.99, active: true },
      { name: '5mg', sku: 'TB500-5MG', price: 59.99, active: true },
      { name: '10mg', sku: 'TB500-10MG', price: 99.99, active: true },
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
      { name: '2mg', sku: 'IPA-2MG', price: 24.99, active: true },
      { name: '5mg', sku: 'IPA-5MG', price: 49.99, active: true },
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
      { name: '2mg', sku: 'CJC-2MG', price: 34.99, active: true },
      { name: '5mg', sku: 'CJC-5MG', price: 74.99, active: true },
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
      { name: '10mg', sku: 'MT2-10MG', price: 44.99, active: true },
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
      { name: '2mg', sku: 'SERM-2MG', price: 29.99, active: true },
      { name: '5mg', sku: 'SERM-5MG', price: 59.99, active: true },
    ],
  },
];

module.exports = { sampleProducts };
