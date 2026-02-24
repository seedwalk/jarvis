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

if (!fs.existsSync(sourceDir)) {
  fail(`Source commands not found: ${sourceDir}`)
}

const targetDir = installScope === "global"
  ? path.join(os.homedir(), ".config", "opencode", "commands", "jarvis")
  : path.join(process.cwd(), ".opencode", "commands", "jarvis")

if (isUninstall) {
  uninstall(targetDir)
  process.exit(0)
}

install(sourceDir, targetDir)

function install(fromDir, toDir) {
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

  console.log("Jarvis installed successfully.")
  console.log(`Mode: ${installScope}`)
  console.log(`Target: ${toDir}`)
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

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}
