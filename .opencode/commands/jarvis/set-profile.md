---
name: jarvis-set-profile
description: Switch model profile for Jarvis agents (quality/balanced/budget)
arguments:
  - name: profile
    description: "Profile name: quality, balanced, or budget"
    required: true
agent: gsd-set-profile
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Switch the project’s active model profile (quality/balanced/budget).

Implementation lives in the `gsd-set-profile` agent so we don’t duplicate the full switching/migration logic in multiple places.
</objective>

<process>

Run the profile switch using the `gsd-set-profile` agent.

</process>

<examples>

**Switch to budget profile:**

```text
/jarvis-set-profile budget

✓ Active profile set to: budget
```

**Switch to quality profile:**

```text
/jarvis-set-profile quality

✓ Active profile set to: quality
```

</examples>
