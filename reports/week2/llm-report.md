# LLM Usage Report — Week 2

## Tools used

| Tool | Purpose |
|------|---------|
| Claude (Anthropic) | analysis.md; nginx configuration; Figma prototype construction via MCP; customer meeting transcript translation and sanitisation; customer meeting summary; |

---

## How AI tools were used

### Figma prototype construction

All seven prototype screens were constructed programmatically using the Figma MCP plugin (`use_figma` tool), which executes JavaScript in the Figma plugin context. Claude authored each screen's layout script (sidebar, header, content area, state variations) based on team-provided design direction. The team reviewed and approved each screen in Figma.

### Customer meeting transcript and summary

The raw Russian transcript was provided by the team. Claude translated, sanitised (removed profanity and off-topic exchanges), and structured the English transcript published in this repository. Claude also wrote the meeting summary (`customer-meeting-summary.md`) based on the translated transcript. The team reviewed both documents for accuracy before committing.

### Analysis

Claude was used to structure the `analysis.md` document:
- Extracting validated assumptions from the interview notes
- Identifying open questions and unresolved constraints
- Proposing a planned response table linking findings to affected stories

The post-meeting sections (interface design, MVP v0 deployment, customer validation) were written by Claude based on team-provided context after the meeting. Team members reviewed all entries.

---

## Limitations and safeguards

- All AI-generated content was reviewed for accuracy against source documents before inclusion.
- No real credentials, personal data, or confidential business information were passed to external LLM services.
- Generic or filler AI output was rejected and replaced with team-specific analysis.
- The team retains full understanding of all AI-assisted outputs and can explain every decision made.
