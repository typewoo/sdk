#!/usr/bin/env node
/**
 * WooCommerce REST API Structure Monitor
 *
 * This script fetches the WooCommerce REST API structure from the specified
 * WordPress installation and creates/compares snapshots to detect changes.
 *
 * Usage:
 * - Create snapshot: node scripts/wc-admin-api-monitor.mjs --create --path=/wp-json/wc/v3
 * - Check for changes: node scripts/wc-admin-api-monitor.mjs --check --path=/wp-json/wc/store/v1
 * - Compare with baseline: node scripts/wc-admin-api-monitor.mjs --compare --path=/wp-json/wc/v3
 *
 * Supported paths:
 * - /wp-json/wc/v3 (Admin REST API)
 * - /wp-json/wc/store/v1 (Store API)
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Configuration
const API_BASE_URL = process.env.WC_API_BASE_URL || 'http://localhost:8080';

// Parse command line arguments
function parseArguments() {
  const args = process.argv.slice(2);
  const parsed = {
    command: null,
    path: '/wp-json/wc/v3', // Default to admin API
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      if (arg === '--create' || arg === '--check' || arg === '--compare') {
        parsed.command = arg;
      } else if (arg === '--path') {
        parsed.path = args[i + 1];
        i++; // Skip next argument as it's the path value
      } else if (arg.startsWith('--path=')) {
        parsed.path = arg.split('=')[1];
      }
    }
  }

  return parsed;
}

// Get API configuration based on path
function getApiConfig(apiPath) {
  const config = {
    endpoint: apiPath,
    name: '',
    version: '',
    routePrefix: '',
  };

  if (apiPath.includes('/wc/v3')) {
    config.name = 'admin';
    config.version = 'v3';
    config.routePrefix = '/wc/v3/';
  } else if (apiPath.includes('/wc/store/v1')) {
    config.name = 'store';
    config.version = 'v1';
    config.routePrefix = '/wc/store/v1/';
  } else {
    throw new Error(`Unsupported API path: ${apiPath}`);
  }

  return config;
}

// Get snapshots directory based on API type
function getSnapshotsDir(apiConfig) {
  const baseDir = join(process.cwd(), 'snapshots', 'api-structure');
  const apiDir = join(baseDir, apiConfig.name);

  if (!existsSync(apiDir)) {
    mkdirSync(apiDir, { recursive: true });
  }

  return apiDir;
}

/**
 * Fetch API structure information from WooCommerce REST API
 */
async function fetchApiStructure(apiConfig) {
  try {
    console.log(
      `Fetching ${apiConfig.name} API structure from ${API_BASE_URL}${apiConfig.endpoint}...`
    );

    // First, get the root API information
    const rootResponse = await fetch(`${API_BASE_URL}${apiConfig.endpoint}`);
    if (!rootResponse.ok) {
      throw new Error(
        `Failed to fetch root API: ${rootResponse.status} ${rootResponse.statusText}`
      );
    }

    const rootData = await rootResponse.json();

    // Extract routes and their information
    const routes = rootData.routes || {};
    const apiStructure = {
      timestamp: new Date().toISOString(),
      apiType: apiConfig.name,
      apiVersion: apiConfig.version,
      baseUrl: `${API_BASE_URL}${apiConfig.endpoint}`,
      routes: {},
      namespaces: rootData.namespaces || [],
      authentication: rootData.authentication || {},
    };

    // Process each route to extract structure information
    for (const [routePath, routeData] of Object.entries(routes)) {
      // Only include routes for the specified API
      if (!routePath.startsWith(apiConfig.routePrefix)) continue;

      const cleanPath = routePath.replace(apiConfig.routePrefix, '');
      apiStructure.routes[cleanPath] = {
        methods: routeData.methods || [],
        endpoints: routeData.endpoints || [],
        // Extract parameter information from endpoints
        parameters: extractParametersFromEndpoints(routeData.endpoints || []),
        // Extract schema information if available
        schema: routeData.schema || null,
      };
    }

    return apiStructure;
  } catch (error) {
    throw new Error(`Failed to fetch API structure: ${error.message}`);
  }
}

/**
 * Extract parameter information from route endpoints
 */
function extractParametersFromEndpoints(endpoints) {
  const allParams = {};

  endpoints.forEach((endpoint) => {
    if (endpoint.args) {
      Object.keys(endpoint.args).forEach((paramName) => {
        if (!allParams[paramName]) {
          allParams[paramName] = {
            methods: new Set(),
            ...endpoint.args[paramName],
          };
        }

        // Track which HTTP methods use this parameter
        endpoint.methods?.forEach((method) => {
          allParams[paramName].methods.add(method);
        });
      });
    }
  });

  // Convert Sets to arrays for JSON serialization
  Object.keys(allParams).forEach((paramName) => {
    allParams[paramName].methods = Array.from(
      allParams[paramName].methods
    ).sort();
  });

  return allParams;
}

/**
 * Create a new API structure snapshot
 */
async function createSnapshot(apiConfig) {
  try {
    const apiStructure = await fetchApiStructure(apiConfig);
    const snapshotsDir = getSnapshotsDir(apiConfig);
    const currentSnapshot = join(snapshotsDir, 'current.json');
    const baselineSnapshot = join(snapshotsDir, 'baseline.json');

    // Save current snapshot
    writeFileSync(currentSnapshot, JSON.stringify(apiStructure, null, 2));
    console.log(
      `✅ ${apiConfig.name} API structure snapshot created: ${currentSnapshot}`
    );

    // Create baseline if it doesn't exist
    if (!existsSync(baselineSnapshot)) {
      writeFileSync(baselineSnapshot, JSON.stringify(apiStructure, null, 2));
      console.log(
        `✅ ${apiConfig.name} API baseline snapshot created: ${baselineSnapshot}`
      );
    }

    return apiStructure;
  } catch (error) {
    console.error(
      `❌ Failed to create ${apiConfig.name} API snapshot: ${error.message}`
    );
    process.exit(1);
  }
}

/**
 * Compare two API structure snapshots and return differences
 */
function compareStructures(baseline, current) {
  const differences = {
    addedRoutes: [],
    removedRoutes: [],
    modifiedRoutes: [],
    parameterChanges: {},
  };

  const baselineRoutes = new Set(Object.keys(baseline.routes));
  const currentRoutes = new Set(Object.keys(current.routes));

  // Find added routes
  differences.addedRoutes = Array.from(currentRoutes).filter(
    (route) => !baselineRoutes.has(route)
  );

  // Find removed routes
  differences.removedRoutes = Array.from(baselineRoutes).filter(
    (route) => !currentRoutes.has(route)
  );

  // Find modified routes
  const commonRoutes = Array.from(currentRoutes).filter((route) =>
    baselineRoutes.has(route)
  );

  commonRoutes.forEach((route) => {
    const baselineRoute = baseline.routes[route];
    const currentRoute = current.routes[route];

    const routeChanges = {
      methodChanges: [],
      parameterChanges: [],
    };

    // Check method changes
    const baselineMethods = new Set(baselineRoute.methods);
    const currentMethods = new Set(currentRoute.methods);

    const addedMethods = Array.from(currentMethods).filter(
      (method) => !baselineMethods.has(method)
    );
    const removedMethods = Array.from(baselineMethods).filter(
      (method) => !currentMethods.has(method)
    );

    if (addedMethods.length || removedMethods.length) {
      routeChanges.methodChanges = {
        added: addedMethods,
        removed: removedMethods,
      };
    }

    // Check parameter changes
    const baselineParams = Object.keys(baselineRoute.parameters || {});
    const currentParams = Object.keys(currentRoute.parameters || {});

    const addedParams = currentParams.filter(
      (param) => !baselineParams.includes(param)
    );
    const removedParams = baselineParams.filter(
      (param) => !currentParams.includes(param)
    );

    if (addedParams.length || removedParams.length) {
      routeChanges.parameterChanges = {
        added: addedParams,
        removed: removedParams,
      };
    }

    // Check for parameter definition changes
    const commonParams = currentParams.filter((param) =>
      baselineParams.includes(param)
    );
    commonParams.forEach((param) => {
      const baselineParam = baselineRoute.parameters[param];
      const currentParam = currentRoute.parameters[param];

      // Simple deep comparison for parameter changes
      if (JSON.stringify(baselineParam) !== JSON.stringify(currentParam)) {
        if (!routeChanges.parameterChanges.modified) {
          routeChanges.parameterChanges.modified = [];
        }
        routeChanges.parameterChanges.modified.push({
          parameter: param,
          baseline: baselineParam,
          current: currentParam,
        });
      }
    });

    if (
      routeChanges.methodChanges.length ||
      routeChanges.parameterChanges.length ||
      routeChanges.parameterChanges.modified
    ) {
      differences.modifiedRoutes.push({
        route,
        changes: routeChanges,
      });
    }
  });

  return differences;
}

/**
 * Check for API structure changes
 */
async function checkForChanges(apiConfig) {
  try {
    const snapshotsDir = getSnapshotsDir(apiConfig);
    const currentSnapshot = join(snapshotsDir, 'current.json');
    const baselineSnapshot = join(snapshotsDir, 'baseline.json');

    // Create current snapshot
    const currentStructure = await fetchApiStructure(apiConfig);
    writeFileSync(currentSnapshot, JSON.stringify(currentStructure, null, 2));

    // Load baseline
    if (!existsSync(baselineSnapshot)) {
      console.log(
        `⚠️  No ${apiConfig.name} API baseline snapshot found. Creating one...`
      );
      writeFileSync(
        baselineSnapshot,
        JSON.stringify(currentStructure, null, 2)
      );
      console.log(
        `✅ ${apiConfig.name} API baseline snapshot created. Run the check again to compare.`
      );
      return;
    }

    const baselineStructure = JSON.parse(
      readFileSync(baselineSnapshot, 'utf8')
    );

    // Compare structures
    const differences = compareStructures(baselineStructure, currentStructure);
    const hasChanges =
      differences.addedRoutes.length ||
      differences.removedRoutes.length ||
      differences.modifiedRoutes.length;

    if (!hasChanges) {
      console.log(`✅ No ${apiConfig.name} API structure changes detected.`);
      console.log(`   Baseline: ${baselineStructure.timestamp}`);
      console.log(`   Current:  ${currentStructure.timestamp}`);
      return false;
    }

    // Report changes
    console.log(
      `🚨 ${apiConfig.name.toUpperCase()} API STRUCTURE CHANGES DETECTED:`
    );
    console.log(`   Baseline: ${baselineStructure.timestamp}`);
    console.log(`   Current:  ${currentStructure.timestamp}\n`);

    if (differences.addedRoutes.length) {
      console.log(`➕ Added Routes (${differences.addedRoutes.length}):`);
      differences.addedRoutes.forEach((route) => console.log(`   + ${route}`));
      console.log();
    }

    if (differences.removedRoutes.length) {
      console.log(`➖ Removed Routes (${differences.removedRoutes.length}):`);
      differences.removedRoutes.forEach((route) =>
        console.log(`   - ${route}`)
      );
      console.log();
    }

    if (differences.modifiedRoutes.length) {
      console.log(`🔄 Modified Routes (${differences.modifiedRoutes.length}):`);
      differences.modifiedRoutes.forEach(({ route, changes }) => {
        console.log(`   ~ ${route}:`);

        if (changes.methodChanges.added?.length) {
          console.log(
            `     + Methods: ${changes.methodChanges.added.join(', ')}`
          );
        }
        if (changes.methodChanges.removed?.length) {
          console.log(
            `     - Methods: ${changes.methodChanges.removed.join(', ')}`
          );
        }
        if (changes.parameterChanges.added?.length) {
          console.log(
            `     + Parameters: ${changes.parameterChanges.added.join(', ')}`
          );
        }
        if (changes.parameterChanges.removed?.length) {
          console.log(
            `     - Parameters: ${changes.parameterChanges.removed.join(', ')}`
          );
        }
        if (changes.parameterChanges.modified?.length) {
          console.log(
            `     ~ Modified Parameters: ${changes.parameterChanges.modified
              .map((p) => p.parameter)
              .join(', ')}`
          );
        }
      });
      console.log();
    }

    // Save the differences report
    const reportPath = join(
      snapshotsDir,
      `changes-${new Date().toISOString().split('T')[0]}.json`
    );
    writeFileSync(reportPath, JSON.stringify(differences, null, 2));
    console.log(`📊 Detailed changes report saved to: ${reportPath}`);

    return true;
  } catch (error) {
    console.error(
      `❌ Failed to check for ${apiConfig.name} API changes: ${error.message}`
    );
    process.exit(1);
  }
}

/**
 * Compare current with baseline (for manual use)
 */
function compareWithBaseline(apiConfig) {
  try {
    const snapshotsDir = getSnapshotsDir(apiConfig);
    const currentSnapshot = join(snapshotsDir, 'current.json');
    const baselineSnapshot = join(snapshotsDir, 'baseline.json');

    if (!existsSync(currentSnapshot) || !existsSync(baselineSnapshot)) {
      console.log(
        `❌ Missing ${apiConfig.name} API snapshots. Run with --create first.`
      );
      return;
    }

    const baseline = JSON.parse(readFileSync(baselineSnapshot, 'utf8'));
    const current = JSON.parse(readFileSync(currentSnapshot, 'utf8'));

    const differences = compareStructures(baseline, current);
    const hasChanges =
      differences.addedRoutes.length ||
      differences.removedRoutes.length ||
      differences.modifiedRoutes.length;

    if (!hasChanges) {
      console.log(
        `✅ No differences between ${apiConfig.name} API baseline and current snapshots.`
      );
    } else {
      console.log(
        `🔍 Differences found between ${apiConfig.name} API snapshots:`
      );
      console.log(JSON.stringify(differences, null, 2));
    }

    return hasChanges;
  } catch (error) {
    console.error(
      `❌ Failed to compare ${apiConfig.name} API snapshots: ${error.message}`
    );
    process.exit(1);
  }
}

// Main execution
const args = parseArguments();

if (!args.command) {
  console.log(
    `Usage: node scripts/wc-admin-api-monitor.mjs [--create|--check|--compare] --path=<api-path>`
  );
  console.log(`  --create   Create a new API structure snapshot`);
  console.log(
    `  --check    Check for changes against baseline (creates current snapshot)`
  );
  console.log(`  --compare  Compare existing current and baseline snapshots`);
  console.log(``);
  console.log(`API Paths:`);
  console.log(
    `  --path=/wp-json/wc/v3        WooCommerce Admin REST API (default)`
  );
  console.log(`  --path=/wp-json/wc/store/v1  WooCommerce Store API`);
  console.log(``);
  console.log(`Examples:`);
  console.log(
    `  node scripts/wc-admin-api-monitor.mjs --create --path=/wp-json/wc/v3`
  );
  console.log(
    `  node scripts/wc-admin-api-monitor.mjs --check --path=/wp-json/wc/store/v1`
  );
  process.exit(1);
}

try {
  const apiConfig = getApiConfig(args.path);
  console.log(
    `📡 Monitoring ${apiConfig.name} API (${apiConfig.version}) at ${args.path}`
  );

  switch (args.command) {
    case '--create': {
      await createSnapshot(apiConfig);
      break;
    }
    case '--check': {
      const hasChanges = await checkForChanges(apiConfig);
      process.exit(hasChanges ? 1 : 0);
      break;
    }
    case '--compare': {
      const hasDifferences = compareWithBaseline(apiConfig);
      process.exit(hasDifferences ? 1 : 0);
      break;
    }
  }
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
