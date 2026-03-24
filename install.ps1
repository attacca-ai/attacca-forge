# =============================================================================
# install.ps1 — Install Attacca Forge plugin for Claude Code (Windows)
# Usage: git clone <repo-url>; cd attacca-forge; .\install.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

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

# ─── Create plugin directories ───────────────────────────────────────────────
$PluginDir = Join-Path $ClaudeDir "plugins\local\attacca-forge"
$CacheDir = Join-Path $ClaudeDir "plugins\cache\attacca-forge\attacca-forge\0.1.0"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Installing plugin..."

# Copy to local plugins
if ($ScriptDir -ne $PluginDir) {
    New-Item -ItemType Directory -Force -Path $PluginDir | Out-Null
    Copy-Item -Recurse -Force (Join-Path $ScriptDir ".claude-plugin") $PluginDir
    Copy-Item -Recurse -Force (Join-Path $ScriptDir "skills") $PluginDir
    Write-Host "  Copied to $PluginDir" -ForegroundColor Green
} else {
    Write-Host "  Already in place at $PluginDir" -ForegroundColor Green
}

# Copy to cache
New-Item -ItemType Directory -Force -Path $CacheDir | Out-Null
Copy-Item -Recurse -Force (Join-Path $ScriptDir ".claude-plugin") $CacheDir
Copy-Item -Recurse -Force (Join-Path $ScriptDir "skills") $CacheDir
Write-Host "  Cache created at $CacheDir" -ForegroundColor Green

# ─── Register in installed_plugins.json ──────────────────────────────────────
$PluginsFile = Join-Path $ClaudeDir "plugins\installed_plugins.json"
$Timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.000Z")
$CachePathJson = $CacheDir.Replace("\", "/")

if (Test-Path $PluginsFile) {
    $content = Get-Content $PluginsFile -Raw | ConvertFrom-Json

    if ($content.plugins.PSObject.Properties.Name -contains "attacca-forge@attacca-forge") {
        Write-Host "  Already registered in installed_plugins.json" -ForegroundColor Yellow
    } else {
        $entry = @(
            @{
                scope = "user"
                installPath = $CachePathJson
                version = "0.1.0"
                installedAt = $Timestamp
                lastUpdated = $Timestamp
            }
        )
        $content.plugins | Add-Member -NotePropertyName "attacca-forge@attacca-forge" -NotePropertyValue $entry
        $content | ConvertTo-Json -Depth 10 | Set-Content $PluginsFile
        Write-Host "  Registered in installed_plugins.json" -ForegroundColor Green
    }
} else {
    $pluginsDir = Split-Path $PluginsFile
    New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null

    $data = @{
        version = 2
        plugins = @{
            "attacca-forge@attacca-forge" = @(
                @{
                    scope = "user"
                    installPath = $CachePathJson
                    version = "0.1.0"
                    installedAt = $Timestamp
                    lastUpdated = $Timestamp
                }
            )
        }
    }
    $data | ConvertTo-Json -Depth 10 | Set-Content $PluginsFile
    Write-Host "  Created $PluginsFile" -ForegroundColor Green
}

# ─── Done ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Skills installed:"
Write-Host "  - attacca-forge:spec-architect  (Full spec with intent + eval)"
Write-Host "  - attacca-forge:spec-writer     (Lean/fast implementation spec)"
Write-Host ""
Write-Host "Coming soon:"
Write-Host "  - attacca-forge:stress-test     (Factorial stress testing)"
Write-Host "  - attacca-forge:intent-spec     (Agent intent specification)"
Write-Host "  - attacca-forge:intent-audit    (Organizational intent gap audit)"
Write-Host "  - attacca-forge:build-orchestrator (Spec-tests-code pipeline)"
Write-Host ""
Write-Host "Restart Claude Code for the skills to take effect." -ForegroundColor Yellow
Write-Host ""
