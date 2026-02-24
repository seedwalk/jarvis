---
name: jarvis-ship
description: Final shipping flow with one commit and PR
tools:
  - read
  - bash
  - question
---

<objective>
Prepare final shipping with one commit, push, and pull request template.
</objective>

<process>
1. Validate all planned phases are complete or explicitly deferred.
2. Ensure ship policy from `.jarvis/config.json` is respected.
3. Prepare one final commit message proposal based on current changes.
4. Create commit, push branch, and open PR using repository template.
5. Return commit hash and PR URL.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-help`
- `/jarvis-new-milestone "next objective"`
</offer_next>
