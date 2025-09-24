#!/usr/bin/env bash
# Simple script to append generated application passwords to the .env file
# Run this after WordPress setup completes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../../../.env"

echo "Adding application passwords to .env file..."

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
if grep -q "WP_ADMIN_APP_PASSWORD" "$ENV_FILE" 2>/dev/null; then
  echo "Updating existing application passwords in .env..."
  
  # Create a temporary file for the updated content
  TEMP_FILE="${ENV_FILE}.tmp"
  
  # Update the passwords line by line
  while IFS= read -r line; do
    if [[ "$line" =~ ^WP_ADMIN_APP_PASSWORD= ]]; then
      echo "WP_ADMIN_APP_PASSWORD=${ADMIN_PASSWORD}"
    else
      echo "$line"
    fi
  done < "$ENV_FILE" > "$TEMP_FILE"
  
  # Replace the original file with the updated one
  mv "$TEMP_FILE" "$ENV_FILE"
  
else
  echo "Adding new application passwords to .env..."
  cat >> "$ENV_FILE" << EOF

# Application passwords for API testing (auto-generated)
WP_ADMIN_APP_PASSWORD=${ADMIN_PASSWORD}
EOF
fi

echo "✅ Application passwords added to .env file:"
echo "   WP_ADMIN_APP_PASSWORD=${ADMIN_PASSWORD}"