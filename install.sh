#!/usr/bin/env bash
# =============================================================================
# install.sh — Install Attacca Forge as a Claude Code marketplace + plugin
#
# Marketplace registration approach (same pattern as nirbound-marketplace):
#   1. Build marketplace structure at ~/.claude/plugins/local/attacca-forge/
#   2. Register in settings.json (extraKnownMarketplaces + enabledPlugins)
#   3. Register in known_marketplaces.json
#   4. Register in installed_plugins.json + populate cache
#
# Usage: git clone <repo-url> && cd attacca-forge && ./install.sh
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

MARKETPLACE_NAME="attacca-forge"
PLUGIN_NAME="attacca-forge"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Read version from package.json
VERSION=$(grep -o '"version": *"[^"]*"' "$SCRIPT_DIR/package.json" | head -1 | grep -o '"[^"]*"$' | tr -d '"')
if [ -z "$VERSION" ]; then
  VERSION="0.6.0"
fi

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

# ─── Step 1: Build marketplace structure ─────────────────────────────────────
TARGET_DIR="$CLAUDE_DIR/plugins/local/$MARKETPLACE_NAME"
PLUGIN_DIR="$TARGET_DIR/plugins/$PLUGIN_NAME"

echo "Installing plugin (v$VERSION)..."

mkdir -p "$TARGET_DIR/.claude-plugin"
mkdir -p "$PLUGIN_DIR/.claude-plugin"
mkdir -p "$PLUGIN_DIR/skills"

# Write marketplace.json at marketplace root
cat > "$TARGET_DIR/.claude-plugin/marketplace.json" << JSONEOF
{
  "\$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "$MARKETPLACE_NAME",
  "description": "Spec-driven AI development toolkit — design, evaluate, stress-test, and certify autonomous agents",
  "owner": {
    "name": "Attacca"
  },
  "plugins": [
    {
      "name": "$PLUGIN_NAME",
      "description": "AI agent development methodology — design, evaluate, and align autonomous agents",
      "version": "$VERSION",
      "author": {
        "name": "Attacca"
      },
      "source": "./plugins/$PLUGIN_NAME",
      "category": "development"
    }
  ]
}
JSONEOF

# Copy plugin.json to plugin subdirectory
cp "$SCRIPT_DIR/.claude-plugin/plugin.json" "$PLUGIN_DIR/.claude-plugin/plugin.json"

# Copy skills to plugin subdirectory
cp -r "$SCRIPT_DIR/skills/"* "$PLUGIN_DIR/skills/"

# Count skills
SKILL_COUNT=$(find "$PLUGIN_DIR/skills" -name "SKILL.md" -type f | wc -l | tr -d ' ')
echo -e "  ✓ Installed ${GREEN}$SKILL_COUNT skills${NC}"
echo -e "    Marketplace: ${GREEN}$TARGET_DIR${NC}"

# ─── Step 2: Register in settings.json ───────────────────────────────────────
SETTINGS_FILE="$CLAUDE_DIR/settings.json"
TARGET_DIR_JSON=$(echo "$TARGET_DIR" | sed 's|\\|\\\\|g')

register_settings() {
  python3 -c "
import json, os

settings_path = '$SETTINGS_FILE'
target_dir = '$TARGET_DIR_JSON'
marketplace = '$MARKETPLACE_NAME'
plugin_key = '$PLUGIN_NAME@$MARKETPLACE_NAME'

if os.path.exists(settings_path):
    with open(settings_path, 'r') as f:
        settings = json.load(f)
else:
    settings = {}

changed = False

# Add extraKnownMarketplaces
if 'extraKnownMarketplaces' not in settings:
    settings['extraKnownMarketplaces'] = {}
if marketplace not in settings['extraKnownMarketplaces']:
    settings['extraKnownMarketplaces'][marketplace] = {
        'source': {
            'source': 'directory',
            'path': target_dir
        }
    }
    changed = True

# Add enabledPlugins
if 'enabledPlugins' not in settings:
    settings['enabledPlugins'] = {}
if plugin_key not in settings['enabledPlugins']:
    settings['enabledPlugins'][plugin_key] = True
    changed = True

if changed:
    with open(settings_path, 'w') as f:
        json.dump(settings, f, indent=2)
    print('updated')
else:
    print('already configured')
" 2>/dev/null
}

register_settings_node() {
  node -e "
const fs = require('fs');
const settingsPath = '$SETTINGS_FILE';
const targetDir = '$TARGET_DIR_JSON';
const marketplace = '$MARKETPLACE_NAME';
const pluginKey = '${PLUGIN_NAME}@${MARKETPLACE_NAME}';

let settings = {};
if (fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

let changed = false;

if (!settings.extraKnownMarketplaces) settings.extraKnownMarketplaces = {};
if (!settings.extraKnownMarketplaces[marketplace]) {
  settings.extraKnownMarketplaces[marketplace] = {
    source: { source: 'directory', path: targetDir }
  };
  changed = true;
}

if (!settings.enabledPlugins) settings.enabledPlugins = {};
if (settings.enabledPlugins[pluginKey] === undefined) {
  settings.enabledPlugins[pluginKey] = true;
  changed = true;
}

if (changed) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
  console.log('updated');
} else {
  console.log('already configured');
}
" 2>/dev/null
}

SETTINGS_RESULT=$(register_settings || register_settings_node || echo "failed")
if [ "$SETTINGS_RESULT" = "failed" ]; then
  echo -e "  ${YELLOW}⚠ Could not update settings.json automatically${NC}"
  echo "    Please add manually — see README.md"
else
  echo -e "  ✓ Settings ${GREEN}$SETTINGS_RESULT${NC}"
fi

# ─── Step 3: Register in known_marketplaces.json ─────────────────────────────
MARKETPLACES_FILE="$CLAUDE_DIR/plugins/known_marketplaces.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%SZ")

register_marketplace() {
  python3 -c "
import json, os

path = '$MARKETPLACES_FILE'
data = {}
if os.path.exists(path):
    with open(path, 'r') as f:
        data = json.load(f)

data['$MARKETPLACE_NAME'] = {
    'source': {
        'source': 'directory',
        'path': '$TARGET_DIR_JSON'
    },
    'installLocation': '$TARGET_DIR_JSON',
    'lastUpdated': '$TIMESTAMP'
}

with open(path, 'w') as f:
    json.dump(data, f, indent=2)
" 2>/dev/null
}

register_marketplace_node() {
  node -e "
const fs = require('fs');
const path = '$MARKETPLACES_FILE';
let data = {};
if (fs.existsSync(path)) {
  data = JSON.parse(fs.readFileSync(path, 'utf8'));
}
data['$MARKETPLACE_NAME'] = {
  source: { source: 'directory', path: '$TARGET_DIR_JSON' },
  installLocation: '$TARGET_DIR_JSON',
  lastUpdated: '$TIMESTAMP'
};
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
" 2>/dev/null
}

register_marketplace || register_marketplace_node || echo -e "  ${YELLOW}⚠ Could not register marketplace${NC}"
echo -e "  ✓ Marketplace ${GREEN}registered${NC}"

# ─── Step 4: Register in installed_plugins.json + populate cache ─────────────
CACHE_DIR="$CLAUDE_DIR/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION"
INSTALLED_FILE="$CLAUDE_DIR/plugins/installed_plugins.json"
CACHE_PATH_JSON=$(echo "$CACHE_DIR" | sed 's|\\|/|g')

# Copy to cache
mkdir -p "$CACHE_DIR/.claude-plugin"
cp "$PLUGIN_DIR/.claude-plugin/plugin.json" "$CACHE_DIR/.claude-plugin/plugin.json"
cp -r "$PLUGIN_DIR/skills" "$CACHE_DIR/"

register_plugin() {
  python3 -c "
import json, os

path = '$INSTALLED_FILE'
data = {'version': 2, 'plugins': {}}
if os.path.exists(path):
    with open(path, 'r') as f:
        data = json.load(f)
    if 'plugins' not in data:
        data['plugins'] = {}

key = '${PLUGIN_NAME}@${MARKETPLACE_NAME}'
now = '$TIMESTAMP'

if key in data['plugins']:
    data['plugins'][key][0]['version'] = '$VERSION'
    data['plugins'][key][0]['installPath'] = '$CACHE_PATH_JSON'
    data['plugins'][key][0]['lastUpdated'] = now
else:
    data['plugins'][key] = [{
        'scope': 'user',
        'installPath': '$CACHE_PATH_JSON',
        'version': '$VERSION',
        'installedAt': now,
        'lastUpdated': now
    }]

with open(path, 'w') as f:
    json.dump(data, f, indent=2)
" 2>/dev/null
}

register_plugin_node() {
  node -e "
const fs = require('fs');
const path = '$INSTALLED_FILE';
let data = { version: 2, plugins: {} };
if (fs.existsSync(path)) {
  data = JSON.parse(fs.readFileSync(path, 'utf8'));
  if (!data.plugins) data.plugins = {};
}
const key = '${PLUGIN_NAME}@${MARKETPLACE_NAME}';
const now = '$TIMESTAMP';
if (data.plugins[key]) {
  data.plugins[key][0].version = '$VERSION';
  data.plugins[key][0].installPath = '$CACHE_PATH_JSON';
  data.plugins[key][0].lastUpdated = now;
} else {
  data.plugins[key] = [{
    scope: 'user',
    installPath: '$CACHE_PATH_JSON',
    version: '$VERSION',
    installedAt: now,
    lastUpdated: now
  }];
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
" 2>/dev/null
}

register_plugin || register_plugin_node || echo -e "  ${YELLOW}⚠ Could not register plugin${NC}"
echo -e "  ✓ Plugin ${GREEN}registered${NC}"

# ─── Done ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}Installation complete!${NC} (v$VERSION, $SKILL_COUNT skills)"
echo ""
echo -e "${YELLOW}Restart Claude Code for the skills to take effect.${NC}"
echo ""
