#!/usr/bin/env bash
# Simple script to copy WordPress .env file to root and append generated application passwords
# Run this after WordPress setup completes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WP_ENV_FILE="$SCRIPT_DIR/../.env"
ROOT_ENV_FILE="$SCRIPT_DIR/../../../.env"

echo "Copying WordPress .env file to project root and adding application passwords..."

# First, copy the WordPress .env file to the root directory
if [ -f "$WP_ENV_FILE" ]; then
  echo "Copying $WP_ENV_FILE to $ROOT_ENV_FILE..."
  cp "$WP_ENV_FILE" "$ROOT_ENV_FILE"
  echo "✅ WordPress .env file copied to project root"
else
  echo "❌ WordPress .env file not found at $WP_ENV_FILE"
  exit 1
fi

# Extract password from the generated file (already extracted by npm script)
PASSWORDS_FILE="$SCRIPT_DIR/generated-app-passwords.txt"
if [ -f "$PASSWORDS_FILE" ]; then
  ADMIN_PASSWORD=$(grep "WP_ADMIN_APP_PASSWORD=" "$PASSWORDS_FILE" | cut -d'=' -f2)
else
  echo "❌ No password file found at $PASSWORDS_FILE"
  echo "    Make sure to run 'npm run wp:extract:passwords' first"
  exit 1
fi

if [ -z "$ADMIN_PASSWORD" ]; then
  echo "❌ Could not extract password from $PASSWORDS_FILE"
  exit 1
fi

# Check if the passwords are already in the .env file
if grep -q "WP_ADMIN_APP_PASSWORD" "$ROOT_ENV_FILE" 2>/dev/null; then
  echo "Updating existing application passwords in .env..."
  
  # Create a temporary file for the updated content
  TEMP_FILE="${ROOT_ENV_FILE}.tmp"
  
  # Update the passwords line by line
  while IFS= read -r line; do
    if [[ "$line" =~ ^WP_ADMIN_APP_PASSWORD= ]]; then
      echo "WP_ADMIN_APP_PASSWORD=${ADMIN_PASSWORD}"
    else
      echo "$line"
    fi
  done < "$ROOT_ENV_FILE" > "$TEMP_FILE"
  
  # Replace the original file with the updated one
  mv "$TEMP_FILE" "$ROOT_ENV_FILE"
  
else
  echo "Adding new application passwords to .env..."
  cat >> "$ROOT_ENV_FILE" << EOF

# Application passwords for API testing (auto-generated)
WP_ADMIN_APP_PASSWORD=${ADMIN_PASSWORD}
EOF
fi

echo "✅ Application passwords added to .env file:"
echo "   WP_ADMIN_APP_PASSWORD=${ADMIN_PASSWORD}"