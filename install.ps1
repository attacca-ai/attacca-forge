# =============================================================================
# install.ps1 — Install Attacca Forge as a Claude Code marketplace + plugin
#
# Marketplace registration approach (same pattern as nirbound-marketplace):
#   1. Build marketplace structure at ~/.claude/plugins/local/attacca-forge/
#   2. Register in settings.json (extraKnownMarketplaces + enabledPlugins)
#   3. Register in known_marketplaces.json
#   4. Register in installed_plugins.json + populate cache
#
# Usage: git clone <repo-url>; cd attacca-forge; .\install.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

$MarketplaceName = "attacca-forge"
$PluginName = "attacca-forge"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Read version from package.json
$PkgJson = Get-Content (Join-Path $ScriptDir "package.json") -Raw | ConvertFrom-Json
$Version = $PkgJson.version
if (-not $Version) { $Version = "0.6.0" }

Write-Host ""
Write-Host "Attacca Forge — Installer" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# ─── Detect Claude directory ─────────────────────────────────────────────────
$ClaudeDir = Join-Path $env:USERPROFILE ".claude"

if (-not (Test-Path $ClaudeDir)) {
    Write-Host "Error: Claude Code config directory not found at $ClaudeDir" -ForegroundColor Red
    Write-Host "Make sure Claude Code is installed and has been run at least once."
    exit 1
}

Write-Host "Claude config: $ClaudeDir" -ForegroundColor Green

# ─── Step 1: Build marketplace structure ─────────────────────────────────────
$TargetDir = Join-Path $ClaudeDir "plugins\local\$MarketplaceName"
$PluginDir = Join-Path $TargetDir "plugins\$PluginName"

Write-Host "Installing plugin (v$Version)..."

# Create directories
New-Item -ItemType Directory -Force -Path (Join-Path $TargetDir ".claude-plugin") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $PluginDir ".claude-plugin") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $PluginDir "skills") | Out-Null

# Write marketplace.json at marketplace root
$MarketplaceJson = @{
    '$schema' = "https://anthropic.com/claude-code/marketplace.schema.json"
    name = $MarketplaceName
    description = "Spec-driven AI development toolkit — design, evaluate, stress-test, and certify autonomous agents"
    owner = @{ name = "Attacca" }
    plugins = @(
        @{
            name = $PluginName
            description = "AI agent development methodology — design, evaluate, and align autonomous agents"
            version = $Version
            author = @{ name = "Attacca" }
            source = "./plugins/$PluginName"
            category = "development"
        }
    )
}
$MarketplaceJson | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $TargetDir ".claude-plugin\marketplace.json")

# Copy plugin.json to plugin subdirectory
Copy-Item -Force (Join-Path $ScriptDir ".claude-plugin\plugin.json") (Join-Path $PluginDir ".claude-plugin\plugin.json")

# Copy skills to plugin subdirectory
Copy-Item -Recurse -Force (Join-Path $ScriptDir "skills\*") (Join-Path $PluginDir "skills")

# Count skills
$SkillCount = (Get-ChildItem -Path (Join-Path $PluginDir "skills") -Filter "SKILL.md" -Recurse).Count
Write-Host "  + Installed $SkillCount skills" -ForegroundColor Green
Write-Host "    Marketplace: $TargetDir" -ForegroundColor Green

# ─── Step 2: Register in settings.json ───────────────────────────────────────
$SettingsFile = Join-Path $ClaudeDir "settings.json"
$PluginKey = "$PluginName@$MarketplaceName"

if (Test-Path $SettingsFile) {
    $Settings = Get-Content $SettingsFile -Raw | ConvertFrom-Json
} else {
    $Settings = [PSCustomObject]@{}
}

$SettingsChanged = $false

# Add extraKnownMarketplaces
if (-not $Settings.PSObject.Properties.Name -contains "extraKnownMarketplaces") {
    $Settings | Add-Member -NotePropertyName "extraKnownMarketplaces" -NotePropertyValue ([PSCustomObject]@{})
}
if (-not $Settings.extraKnownMarketplaces.PSObject.Properties.Name -contains $MarketplaceName) {
    $MarketplaceEntry = [PSCustomObject]@{
        source = [PSCustomObject]@{
            source = "directory"
            path = $TargetDir
        }
    }
    $Settings.extraKnownMarketplaces | Add-Member -NotePropertyName $MarketplaceName -NotePropertyValue $MarketplaceEntry
    $SettingsChanged = $true
}

# Add enabledPlugins
if (-not $Settings.PSObject.Properties.Name -contains "enabledPlugins") {
    $Settings | Add-Member -NotePropertyName "enabledPlugins" -NotePropertyValue ([PSCustomObject]@{})
}
if (-not $Settings.enabledPlugins.PSObject.Properties.Name -contains $PluginKey) {
    $Settings.enabledPlugins | Add-Member -NotePropertyName $PluginKey -NotePropertyValue $true
    $SettingsChanged = $true
}

if ($SettingsChanged) {
    $Settings | ConvertTo-Json -Depth 10 | Set-Content $SettingsFile
    Write-Host "  + Settings updated" -ForegroundColor Green
} else {
    Write-Host "  + Settings already configured" -ForegroundColor Green
}

# ─── Step 3: Register in known_marketplaces.json ─────────────────────────────
$MarketplacesFile = Join-Path $ClaudeDir "plugins\known_marketplaces.json"
$Timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.000Z")

if (Test-Path $MarketplacesFile) {
    $Marketplaces = Get-Content $MarketplacesFile -Raw | ConvertFrom-Json
} else {
    $PluginsParent = Join-Path $ClaudeDir "plugins"
    New-Item -ItemType Directory -Force -Path $PluginsParent | Out-Null
    $Marketplaces = [PSCustomObject]@{}
}

$MarketplaceRegistration = [PSCustomObject]@{
    source = [PSCustomObject]@{
        source = "directory"
        path = $TargetDir
    }
    installLocation = $TargetDir
    lastUpdated = $Timestamp
}

if ($Marketplaces.PSObject.Properties.Name -contains $MarketplaceName) {
    $Marketplaces.$MarketplaceName = $MarketplaceRegistration
} else {
    $Marketplaces | Add-Member -NotePropertyName $MarketplaceName -NotePropertyValue $MarketplaceRegistration
}

$Marketplaces | ConvertTo-Json -Depth 10 | Set-Content $MarketplacesFile
Write-Host "  + Marketplace registered" -ForegroundColor Green

# ─── Step 4: Register in installed_plugins.json + populate cache ─────────────
$CacheDir = Join-Path $ClaudeDir "plugins\cache\$MarketplaceName\$PluginName\$Version"
$InstalledFile = Join-Path $ClaudeDir "plugins\installed_plugins.json"
$CachePathJson = $CacheDir.Replace("\", "/")

# Copy to cache
New-Item -ItemType Directory -Force -Path (Join-Path $CacheDir ".claude-plugin") | Out-Null
Copy-Item -Force (Join-Path $PluginDir ".claude-plugin\plugin.json") (Join-Path $CacheDir ".claude-plugin\plugin.json")
Copy-Item -Recurse -Force (Join-Path $PluginDir "skills") $CacheDir

# Register
if (Test-Path $InstalledFile) {
    $Installed = Get-Content $InstalledFile -Raw | ConvertFrom-Json
    if (-not $Installed.plugins) {
        $Installed | Add-Member -NotePropertyName "plugins" -NotePropertyValue ([PSCustomObject]@{})
    }
} else {
    $Installed = [PSCustomObject]@{
        version = 2
        plugins = [PSCustomObject]@{}
    }
}

$PluginEntry = @(
    [PSCustomObject]@{
        scope = "user"
        installPath = $CachePathJson
        version = $Version
        installedAt = $Timestamp
        lastUpdated = $Timestamp
    }
)

if ($Installed.plugins.PSObject.Properties.Name -contains $PluginKey) {
    $Installed.plugins.$PluginKey = $PluginEntry
} else {
    $Installed.plugins | Add-Member -NotePropertyName $PluginKey -NotePropertyValue $PluginEntry
}

$Installed | ConvertTo-Json -Depth 10 | Set-Content $InstalledFile
Write-Host "  + Plugin registered" -ForegroundColor Green

# ─── Done ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Installation complete! (v$Version, $SkillCount skills)" -ForegroundColor Green
Write-Host ""
Write-Host "Restart Claude Code for the skills to take effect." -ForegroundColor Yellow
Write-Host ""
