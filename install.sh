#!/usr/bin/env bash
# =============================================================================
# install.sh — Install Attacca Forge plugin for Claude Code
# Usage: git clone <repo-url> && cd attacca-forge && ./install.sh
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}Attacca Forge — Installer${NC}"
echo "=========================="
echo ""

# ─── Detect home directory ───────────────────────────────────────────────────
CLAUDE_DIR="$HOME/.claude"

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  CLAUDE_DIR="$USERPROFILE/.claude"
  if [ -z "$CLAUDE_DIR" ] || [ ! -d "$CLAUDE_DIR" ]; then
    CLAUDE_DIR="$HOME/.claude"
  fi
fi

if [ ! -d "$CLAUDE_DIR" ]; then
  echo -e "${RED}Error:${NC} Claude Code config directory not found at $CLAUDE_DIR"
  echo "Make sure Claude Code is installed and has been run at least once."
  exit 1
fi

echo -e "Claude config: ${GREEN}$CLAUDE_DIR${NC}"

# ─── Create plugin directories ──────────────────────────────────────────────
PLUGIN_DIR="$CLAUDE_DIR/plugins/local/attacca-forge"
CACHE_DIR="$CLAUDE_DIR/plugins/cache/attacca-forge/attacca-forge/0.1.0"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing plugin..."

# Copy to local plugins (skip if already running from there)
if [ "$SCRIPT_DIR" != "$PLUGIN_DIR" ]; then
  mkdir -p "$PLUGIN_DIR"
  cp -r "$SCRIPT_DIR/.claude-plugin" "$PLUGIN_DIR/"
  cp -r "$SCRIPT_DIR/plugins" "$PLUGIN_DIR/"
  echo -e "  Copied to ${GREEN}$PLUGIN_DIR${NC}"
else
  echo -e "  Already in place at ${GREEN}$PLUGIN_DIR${NC}"
fi

# Copy to cache
mkdir -p "$CACHE_DIR"
cp -r "$SCRIPT_DIR/plugins/attacca-forge/.claude-plugin" "$CACHE_DIR/"
cp -r "$SCRIPT_DIR/plugins/attacca-forge/skills" "$CACHE_DIR/"
echo -e "  Cache created at ${GREEN}$CACHE_DIR${NC}"

# ─── Register in installed_plugins.json ──────────────────────────────────────
PLUGINS_FILE="$CLAUDE_DIR/plugins/installed_plugins.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Normalize cache path for JSON (forward slashes)
CACHE_PATH_JSON=$(echo "$CACHE_DIR" | sed 's|\\|/|g')

if [ -f "$PLUGINS_FILE" ]; then
  # Check if already registered
  if grep -q "attacca-forge@attacca-forge" "$PLUGINS_FILE" 2>/dev/null; then
    echo -e "  ${YELLOW}Already registered${NC} in installed_plugins.json"
  else
    # Add to existing file
    python3 -c "
import json, sys
with open('$PLUGINS_FILE', 'r') as f:
    data = json.load(f)
data.setdefault('plugins', {})['attacca-forge@attacca-forge'] = [{
    'scope': 'user',
    'installPath': '$CACHE_PATH_JSON',
    'version': '0.1.0',
    'installedAt': '$TIMESTAMP',
    'lastUpdated': '$TIMESTAMP'
}]
with open('$PLUGINS_FILE', 'w') as f:
    json.dump(data, f, indent=2)
print('  Registered in installed_plugins.json')
" 2>/dev/null || {
      # Fallback if python3 not available — try node
      node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$PLUGINS_FILE', 'utf8'));
if (!data.plugins) data.plugins = {};
data.plugins['attacca-forge@attacca-forge'] = [{
  scope: 'user',
  installPath: '$CACHE_PATH_JSON',
  version: '0.1.0',
  installedAt: '$TIMESTAMP',
  lastUpdated: '$TIMESTAMP'
}];
fs.writeFileSync('$PLUGINS_FILE', JSON.stringify(data, null, 2));
console.log('  Registered in installed_plugins.json');
" 2>/dev/null || {
        echo -e "  ${YELLOW}Warning:${NC} Could not auto-register. Please add manually."
        echo "  See README.md for manual registration instructions."
      }
    }
  fi
else
  # Create new file
  mkdir -p "$(dirname "$PLUGINS_FILE")"
  cat > "$PLUGINS_FILE" << JSONEOF
{
  "version": 2,
  "plugins": {
    "attacca-forge@attacca-forge": [
      {
        "scope": "user",
        "installPath": "$CACHE_PATH_JSON",
        "version": "0.1.0",
        "installedAt": "$TIMESTAMP",
        "lastUpdated": "$TIMESTAMP"
      }
    ]
  }
}
JSONEOF
  echo -e "  Created ${GREEN}$PLUGINS_FILE${NC}"
fi

# ─── Done ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}Installation complete!${NC}"
echo ""
echo "Skills installed:"
echo "  - attacca-forge:spec-architect  (Full spec with intent + eval)"
echo "  - attacca-forge:spec-writer     (Lean/fast implementation spec)"
echo ""
echo "Coming soon:"
echo "  - attacca-forge:stress-test     (Factorial stress testing)"
echo "  - attacca-forge:intent-spec     (Agent intent specification)"
echo "  - attacca-forge:intent-audit    (Organizational intent gap audit)"
echo "  - attacca-forge:build-orchestrator (Spec-tests-code pipeline)"
echo ""
echo -e "${YELLOW}Restart Claude Code for the skills to take effect.${NC}"
echo ""
