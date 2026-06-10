# LLM Usage Report — Week 2

## Tools used

| Tool | Purpose |
|------|---------|
| Claude (Anthropic) | Drafting and structuring user stories; writing analysis.md; writing this LLM report; structuring README.md index |
| Claude (Anthropic) — Week 1 | Transcribing and translating interview audio recording to English |

## How AI tools were used

### User story generation

The team provided the following inputs to the LLM:
- Initial draft user stories from the lab 2 activity worksheet (10 stories in xlsx format)
- The Week 1 interview transcript and notes (SWP_Interview_Script.pdf)
- The customer's product requirements document (SU website Ideas.pdf)
- The technical questions document prepared before the interview (Вопросы к ТЗ_ SU Portal.pdf)

Claude was asked to:
1. Review the xlsx draft stories and identify which were valid requirements and which were placeholder/joke stories
2. Supplement the draft stories with additional stories derived from the interview transcript and product spec
3. Format all stories according to the assignment specification (stable IDs, MoSCoW priorities, notes sections)
4. Propose an initial MVP v1 scope grounded in the customer's stated minimum expectations

All generated stories were reviewed by a team member before acceptance. The team made the final judgement on priorities, removed stories, and MVP scope.

### Analysis

Claude was used to structure the `analysis.md` document by:
- Extracting validated assumptions from the interview notes
- Identifying open questions and unresolved constraints
- Proposing a planned response table linking findings to affected stories

Team members added, removed, and adjusted entries based on their direct knowledge of the customer interaction.

### What AI was NOT used for

- The actual customer interview was conducted by team members without AI assistance.
- User research, competitor analysis, and product research (Miro board) were done manually.
- Meeting summaries, transcript sanitisation, and customer approvals are team responsibilities.
- The prototype and MVP v0 implementation are authored by team members.

## Limitations and safeguards

- All AI-generated content was reviewed for accuracy against source documents before inclusion.
- No real credentials, personal data, or confidential business information were passed to external LLM services.
- Generic or filler AI output was rejected and replaced with team-specific analysis.
