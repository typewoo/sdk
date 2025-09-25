# WooCommerce Admin REST API Structure Monitoring

This document provides comprehensive information about the API structure monitoring system implemented in the Store SDK.

## Table of Contents

- [Overview](#overview)
- [Components](#components)
- [Setup and Configuration](#setup-and-configuration)
- [Usage](#usage)
- [Understanding API Changes](#understanding-api-changes)
- [GitHub Actions Integration](#github-actions-integration)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## Overview

The WooCommerce Admin REST API Structure Monitoring system is designed to:

1. **Track API Evolution** - Monitor changes to the WooCommerce Admin REST API structure
2. **Prevent Breaking Changes** - Alert developers to changes that might break the SDK
3. **Automate Detection** - Run continuous monitoring through GitHub Actions
4. **Provide Detailed Reports** - Generate comprehensive change reports with impact analysis

### Why API Monitoring?

- **WooCommerce Updates** - New versions of WooCommerce may introduce API changes
- **Plugin Compatibility** - Third-party plugins might extend or modify the API
- **SDK Maintenance** - Ensure the Store SDK remains compatible with API changes
- **Proactive Development** - Catch breaking changes before they affect production systems

## Components

### 1. Monitoring Script (`scripts/wc-admin-api-monitor.mjs`)

The core monitoring script that:

- Fetches current API structure from `/wp-json/wc/v3`
- Creates and compares snapshots
- Generates detailed change reports
- Provides CLI interface for manual operations

### 2. Integration Test (`packages/core/src/lib/tests/integration/admin/api-structure.integration.spec.ts`)

Integration tests that:

- Validate API structure consistency
- Fail on breaking changes during CI/CD
- Test essential routes availability
- Verify HTTP method consistency

### 3. GitHub Actions Workflow (`.github/workflows/wc-admin-api-monitor.yml`)

Automated workflow that:

- Runs daily monitoring checks
- Triggers on relevant code changes
- Creates GitHub issues for breaking changes
- Stores snapshots as artifacts

### 4. NPM Scripts

Convenient npm commands for manual monitoring:

- `api:monitor:create` - Create baseline
- `api:monitor:check` - Check for changes
- `api:monitor:compare` - Compare snapshots
- `api:monitor:test` - Run integration tests

## Setup and Configuration

### Prerequisites

1. **WordPress Environment** - A running WordPress instance with WooCommerce
2. **Network Access** - Ability to reach the WordPress API endpoint
3. **Admin Access** - Proper authentication for admin endpoints (if required)

### Environment Configuration

Set the WordPress URL for monitoring:

```bash
# Environment variable (preferred)
export WC_API_BASE_URL=http://localhost:8080

# Or inline with commands
WC_API_BASE_URL=https://your-site.com npm run api:monitor:check
```

### Initial Setup

1. **Start WordPress Environment**:

   ```bash
   npm run wp:env:up
   ```

2. **Create Initial Baseline**:

   ```bash
   npm run api:monitor:create
   ```

3. **Verify Setup**:
   ```bash
   npm run api:monitor:check
   ```

## Usage

### Creating a Baseline

Create the initial API structure snapshot:

```bash
npm run api:monitor:create
```

This creates:

- `snapshots/api-structure/baseline.json` - Reference snapshot
- `snapshots/api-structure/current.json` - Current snapshot

### Checking for Changes

Check if the API structure has changed:

```bash
npm run api:monitor:check
```

**Exit Codes:**

- `0` - No changes detected
- `1` - Changes detected or error occurred

### Comparing Snapshots

Compare existing baseline and current snapshots:

```bash
npm run api:monitor:compare
```

### Running Integration Tests

Run the API structure integration tests:

```bash
npm run api:monitor:test
```

### Script Options

The monitoring script supports several command-line options:

```bash
# Create new baseline
node scripts/wc-admin-api-monitor.mjs --create

# Check for changes (creates current snapshot)
node scripts/wc-admin-api-monitor.mjs --check

# Compare existing snapshots
node scripts/wc-admin-api-monitor.mjs --compare
```

## Understanding API Changes

### Change Types

The monitoring system categorizes changes into different types:

#### ✅ **Additive Changes (Safe)**

- **New Routes** - Additional API endpoints
- **New HTTP Methods** - Additional methods on existing routes
- **New Parameters** - Additional optional parameters

_These changes are generally backward-compatible and safe._

#### 🚨 **Breaking Changes (Critical)**

- **Removed Routes** - API endpoints no longer available
- **Removed HTTP Methods** - Methods no longer supported on routes
- **Removed Parameters** - Required parameters no longer available

_These changes may break existing SDK functionality._

#### ℹ️ **Structural Changes (Informational)**

- **Namespace Changes** - API namespace modifications
- **Authentication Changes** - Auth configuration updates
- **Parameter Modifications** - Changes to parameter definitions

### Change Report Structure

The monitoring generates detailed JSON reports:

```json
{
  "addedRoutes": ["new/endpoint"],
  "removedRoutes": ["old/endpoint"],
  "modifiedRoutes": [
    {
      "route": "products",
      "changes": {
        "methodChanges": {
          "added": ["PATCH"],
          "removed": ["DELETE"]
        },
        "parameterChanges": {
          "added": ["new_param"],
          "removed": ["old_param"]
        }
      }
    }
  ],
  "namespacesChanged": false,
  "authenticationChanged": false
}
```

## GitHub Actions Integration

### Workflow Triggers

The monitoring workflow runs on:

1. **Schedule** - Daily at 2 AM UTC
2. **Code Changes** - Pushes/PRs affecting admin services
3. **Manual Trigger** - Workflow dispatch

### Workflow Inputs

Manual triggers support inputs:

- `create_baseline` - Create new baseline instead of checking
- `wp_url` - Override default WordPress URL

### Issue Management

When breaking changes are detected:

1. **New Issue Created** - For first-time detections
2. **Comment Added** - To existing issues for additional changes
3. **Labels Applied** - `api-monitoring`, `critical`, `breaking-change`
4. **Assignees** - Can be configured in the workflow

### Artifacts

The workflow stores:

- API structure snapshots
- Change reports
- Test results

Artifacts are retained for 30 days.

## Troubleshooting

### Common Issues

#### 1. WordPress Not Accessible

**Error**: `Failed to fetch API structure: API request failed: 404`

**Solutions**:

- Verify WordPress is running: `curl http://localhost:8080/wp-json/wc/v3`
- Check the `WC_API_BASE_URL` environment variable
- Ensure WooCommerce is installed and activated

#### 2. No Baseline Found

**Error**: `No baseline snapshot found`

**Solution**:

```bash
npm run api:monitor:create
```

#### 3. Permission Issues

**Error**: `EACCES: permission denied`

**Solutions**:

- Check file permissions on `snapshots/` directory
- Ensure the script has write access
- Run with appropriate user permissions

#### 4. Network Timeouts

**Error**: `fetch failed`

**Solutions**:

- Increase timeout values in the script
- Check network connectivity
- Verify firewall settings

### Debug Mode

Enable verbose logging by modifying the script:

```javascript
// Add at the top of wc-admin-api-monitor.mjs
const DEBUG = process.env.DEBUG === 'true';
```

Then run with:

```bash
DEBUG=true npm run api:monitor:check
```

## Advanced Configuration

### Custom WordPress URL

For different environments:

```bash
# Development
WC_API_BASE_URL=http://localhost:8080 npm run api:monitor:check

# Staging
WC_API_BASE_URL=https://staging.example.com npm run api:monitor:check

# Production (use with caution)
WC_API_BASE_URL=https://production.example.com npm run api:monitor:check
```

### GitHub Actions Customization

Modify `.github/workflows/wc-admin-api-monitor.yml` for:

#### Custom Schedule

```yaml
schedule:
  - cron: '0 6 * * 1' # Monday at 6 AM UTC
```

#### Additional Notifications

```yaml
- name: Slack Notification
  if: steps.check-changes.outputs.changes_detected == 'true'
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: "WooCommerce API changes detected!"
      }
```

#### Custom Issue Labels

```yaml
labels: ['api-monitoring', 'auto-generated', 'needs-review']
```

### Snapshot Management

#### Archiving Old Snapshots

```bash
# Create archive directory
mkdir -p snapshots/archive/$(date +%Y-%m)

# Move old snapshots
mv snapshots/api-structure/changes-*.json snapshots/archive/$(date +%Y-%m)/
```

#### Comparing Different Versions

```bash
# Compare with specific date
node scripts/wc-admin-api-monitor.mjs --compare --baseline=snapshots/archive/2024-01/baseline.json
```

### Integration with CI/CD

#### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run api:monitor:check"
    }
  }
}
```

#### Custom Test Integration

```typescript
// In your test files
import { execSync } from 'child_process';

describe('API Compatibility', () => {
  it('should not have breaking API changes', () => {
    const result = execSync('npm run api:monitor:check', { encoding: 'utf8' });
    expect(result).toContain('No API structure changes detected');
  });
});
```

## Best Practices

1. **Regular Monitoring** - Run checks before major releases
2. **Baseline Updates** - Update baseline after intentional API changes
3. **Change Documentation** - Document all API changes in changelogs
4. **Gradual Migration** - Plan migration strategies for breaking changes
5. **Stakeholder Communication** - Notify users of significant API changes

## Contributing

To contribute to the API monitoring system:

1. **Test Changes** - Ensure monitoring works with various WordPress versions
2. **Documentation** - Update this documentation for any changes
3. **Backward Compatibility** - Maintain compatibility with existing snapshots
4. **Error Handling** - Add robust error handling for edge cases

## Support

For issues with API monitoring:

1. **Check Logs** - Review workflow logs and error messages
2. **Verify Environment** - Ensure WordPress and WooCommerce are properly configured
3. **Report Issues** - Create GitHub issues with detailed reproduction steps
4. **Community Help** - Ask questions in GitHub Discussions
