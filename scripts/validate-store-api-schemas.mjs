#!/usr/bin/env node
/**
 * Store API Schema Validation Script
 *
 * Tests all Store API endpoints against their TypeScript Zod schemas
 * to ensure response structures match our type definitions.
 */

import axios from 'axios';
import { z } from 'zod';

// Configuration
const BASE_URL = 'http://localhost:8080';
const USERNAME = 'admin';
const PASSWORD = 'hRhubyeOhZFgK9zUBOE9jmuK';

// Create auth header
const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${auth}`,
};

// Import schemas from the actual type files
const ImageResponseSchema = z.object({
  id: z.number(),
  src: z.string(),
  thumbnail: z.string(),
  srcset: z.string(),
  sizes: z.string(),
  name: z.string(),
  alt: z.string(),
});

const ProductBrandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  parent: z.number(),
  count: z.number(),
  image: ImageResponseSchema.nullable(),
  review_count: z.number(),
  permalink: z.string(),
});

const ProductCategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  parent: z.number(),
  count: z.number(),
  image: ImageResponseSchema.nullable(),
  review_count: z.number(),
  permalink: z.string(),
});

const ProductTagResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  parent: z.number(),
  count: z.number(),
});

const ProductAttributeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  taxonomy: z.string(),
  type: z.string(),
  order: z.string(),
  has_archives: z.boolean(),
});

// Test results tracker
const results = {
  passed: [],
  failed: [],
  errors: [],
};

/**
 * Test an endpoint against its schema
 */
async function testEndpoint(name, url, schema, isArray = false) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name}`);
  console.log(`URL: ${url}`);
  console.log(`${'='.repeat(60)}`);

  try {
    const response = await axios.get(url, { headers });

    console.log(`✓ HTTP Status: ${response.status}`);
    console.log(`✓ Response received`);

    // Log sample data
    const sampleData = isArray ? response.data[0] : response.data;

    console.log('\nSample Response Data:');
    console.log(JSON.stringify(sampleData, null, 2));

    // Validate against schema
    if (isArray) {
      const arraySchema = z.array(schema);
      const validation = arraySchema.safeParse(response.data);

      if (validation.success) {
        console.log(
          `\n✅ PASSED: Schema validation successful (${response.data.length} items)`
        );
        results.passed.push({
          name,
          url,
          count: response.data.length,
        });
      } else {
        console.log('\n❌ FAILED: Schema validation errors:');
        console.log(JSON.stringify(validation.error.errors, null, 2));
        results.failed.push({
          name,
          url,
          errors: validation.error.errors,
        });
      }
    } else {
      const validation = schema.safeParse(response.data);

      if (validation.success) {
        console.log('\n✅ PASSED: Schema validation successful');
        results.passed.push({ name, url });
      } else {
        console.log('\n❌ FAILED: Schema validation errors:');
        console.log(JSON.stringify(validation.error.errors, null, 2));
        results.failed.push({
          name,
          url,
          errors: validation.error.errors,
        });
      }
    }
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log(
        'Response Data:',
        JSON.stringify(error.response.data, null, 2)
      );
    }
    results.errors.push({
      name,
      url,
      error: error.message,
    });
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('Store API Schema Validation');
  console.log('============================\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Testing as: ${USERNAME}\n`);

  // Test Products Brands - List
  await testEndpoint(
    'Products Brands - List',
    `${BASE_URL}/wp-json/wc/store/v1/products/brands`,
    ProductBrandResponseSchema,
    true
  );

  // Test Products Brands - Single (if we have any brands)
  try {
    const listResponse = await axios.get(
      `${BASE_URL}/wp-json/wc/store/v1/products/brands?per_page=1`,
      { headers }
    );
    if (listResponse.data.length > 0) {
      const brandId = listResponse.data[0].id;
      await testEndpoint(
        'Products Brands - Single',
        `${BASE_URL}/wp-json/wc/store/v1/products/brands/${brandId}`,
        ProductBrandResponseSchema,
        false
      );
    }
  } catch {
    console.log('Skipping single brand test - no brands available');
  }

  // Test Products Categories - List
  await testEndpoint(
    'Products Categories - List',
    `${BASE_URL}/wp-json/wc/store/v1/products/categories`,
    ProductCategoryResponseSchema,
    true
  );

  // Test Products Categories - Single
  try {
    const listResponse = await axios.get(
      `${BASE_URL}/wp-json/wc/store/v1/products/categories?per_page=1`,
      { headers }
    );
    if (listResponse.data.length > 0) {
      const categoryId = listResponse.data[0].id;
      await testEndpoint(
        'Products Categories - Single',
        `${BASE_URL}/wp-json/wc/store/v1/products/categories/${categoryId}`,
        ProductCategoryResponseSchema,
        false
      );
    }
  } catch {
    console.log('Skipping single category test - no categories available');
  }

  // Test Products Tags - List
  await testEndpoint(
    'Products Tags - List',
    `${BASE_URL}/wp-json/wc/store/v1/products/tags`,
    ProductTagResponseSchema,
    true
  );

  // Test Products Tags - Single
  try {
    const listResponse = await axios.get(
      `${BASE_URL}/wp-json/wc/store/v1/products/tags?per_page=1`,
      { headers }
    );
    if (listResponse.data.length > 0) {
      const tagId = listResponse.data[0].id;
      await testEndpoint(
        'Products Tags - Single',
        `${BASE_URL}/wp-json/wc/store/v1/products/tags/${tagId}`,
        ProductTagResponseSchema,
        false
      );
    }
  } catch {
    console.log('Skipping single tag test - no tags available');
  }

  // Test Products Attributes - List
  await testEndpoint(
    'Products Attributes - List',
    `${BASE_URL}/wp-json/wc/store/v1/products/attributes`,
    ProductAttributeResponseSchema,
    true
  );

  // Test Products Attributes - Single
  try {
    const listResponse = await axios.get(
      `${BASE_URL}/wp-json/wc/store/v1/products/attributes?per_page=1`,
      { headers }
    );
    if (listResponse.data.length > 0) {
      const attributeId = listResponse.data[0].id;
      await testEndpoint(
        'Products Attributes - Single',
        `${BASE_URL}/wp-json/wc/store/v1/products/attributes/${attributeId}`,
        ProductAttributeResponseSchema,
        false
      );
    }
  } catch {
    console.log('Skipping single attribute test - no attributes available');
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Errors: ${results.errors.length}`);

  if (results.passed.length > 0) {
    console.log('\nPassed Tests:');
    results.passed.forEach((r) => console.log(`  ✓ ${r.name}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach((r) => {
      console.log(`  ✗ ${r.name}`);
      console.log(`    URL: ${r.url}`);
      r.errors.forEach((err) => {
        console.log(`    - ${err.path.join('.')}: ${err.message}`);
      });
    });
  }

  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.forEach((r) => {
      console.log(`  ✗ ${r.name}: ${r.error}`);
    });
  }

  // Exit with error code if any tests failed
  if (results.failed.length > 0 || results.errors.length > 0) {
    process.exit(1);
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
