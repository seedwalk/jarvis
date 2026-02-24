#!/usr/bin/env node

const fs = require("fs")
const os = require("os")
const path = require("path")

const args = new Set(process.argv.slice(2))

const showHelp = args.has("--help") || args.has("-h")
const isUninstall = args.has("--uninstall")
const isGlobal = args.has("--global") || args.has("-g")
const isLocal = args.has("--local") || args.has("-l")

if (showHelp) {
  printHelp()
  process.exit(0)
}

if (isGlobal && isLocal) {
  fail("Use only one location: --local or --global")
}

const installScope = isGlobal ? "global" : "local"

const repoRoot = path.resolve(__dirname, "..")
const sourceDir = path.join(repoRoot, ".opencode", "commands", "jarvis")
const sourceAssetsDir = path.join(repoRoot, ".opencode", "get-shit-done")

if (!fs.existsSync(sourceDir)) {
  fail(`Source commands not found: ${sourceDir}`)
}

if (!fs.existsSync(sourceAssetsDir)) {
  fail(`Source assets not found: ${sourceAssetsDir}`)
}

const targetOpenCodeDir = installScope === "global"
  ? path.join(os.homedir(), ".config", "opencode")
  : path.join(process.cwd(), ".opencode")

const targetDir = installScope === "global"
  ? path.join(targetOpenCodeDir, "commands", "jarvis")
  : path.join(targetOpenCodeDir, "commands", "jarvis")

const targetAssetsDir = path.join(targetOpenCodeDir, "get-shit-done")

if (isUninstall) {
  uninstall(targetDir)
  process.exit(0)
}

install(sourceDir, targetDir, sourceAssetsDir, targetAssetsDir)

function install(fromDir, toDir, assetsFromDir, assetsToDir) {
  const files = fs
    .readdirSync(fromDir)
    .filter((file) => file.endsWith(".md"))

  if (files.length === 0) {
    fail(`No command files found in: ${fromDir}`)
  }

  fs.mkdirSync(toDir, { recursive: true })

  for (const file of files) {
    fs.copyFileSync(path.join(fromDir, file), path.join(toDir, file))
  }

  copyDirectory(assetsFromDir, assetsToDir)

  console.log("Jarvis installed successfully.")
  console.log(`Mode: ${installScope}`)
  console.log(`Target: ${toDir}`)
  console.log(`Assets: ${assetsToDir}`)
  console.log("\nTry these commands in OpenCode:")
  console.log("- /jarvis-help")
  console.log("- /jarvis-setup")
}

function uninstall(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Nothing to uninstall. Not found: ${dir}`)
    return
  }

  fs.rmSync(dir, { recursive: true, force: true })
  console.log("Jarvis uninstalled successfully.")
  console.log(`Removed: ${dir}`)
}

function printHelp() {
  console.log("jarvis-cc installer")
  console.log("")
  console.log("Usage:")
  console.log("  npx jarvis-cc@latest --opencode --local")
  console.log("  npx jarvis-cc@latest --opencode --global")
  console.log("  npx jarvis-cc@latest --opencode --local --uninstall")
  console.log("")
  console.log("Options:")
  console.log("  --opencode   Install OpenCode commands (default mode)")
  console.log("  --local, -l  Install into current repository")
  console.log("  --global, -g Install into ~/.config/opencode")
  console.log("  --uninstall  Remove installed commands")
  console.log("  --help, -h   Show this help")
}

function copyDirectory(fromDir, toDir) {
  fs.mkdirSync(toDir, { recursive: true })
  const entries = fs.readdirSync(fromDir, { withFileTypes: true })

  for (const entry of entries) {
    const fromPath = path.join(fromDir, entry.name)
    const toPath = path.join(toDir, entry.name)

    if (entry.isDirectory()) {
      copyDirectory(fromPath, toPath)
      continue
    }

    fs.copyFileSync(fromPath, toPath)
  }
}

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}
