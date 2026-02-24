---
name: jarvis-ship
description: Prepare single commit, push branch, and produce PR markdown from template
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Ship current work with a clean branch history and a ready PR body.
</objective>

<process>
1. Read git status and detect base branch from `.jarvis/config.json` (default `main`).
2. Ensure there are changes to ship.
3. Ensure single-commit rule:
   - if multiple local commits not pushed, squash into one commit
   - if already pushed with multiple commits, ask before rewriting history
4. Push branch to remote.
5. Build PR body from `.github/pull_request_template.md`.
6. Print final PR body as markdown in a fenced code block for copy/paste.
7. If `gh` is available and user wants, create PR automatically.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-help`
- `/jarvis-new-milestone "siguiente objetivo"`
</offer_next>
