# Reflection — Week 6

## Learning points

- Removing technical debt early pays off before the final handover. The mock authentication system had been in place since the very beginning of the project. Removing it in Week 6 — rather than leaving it as a "we'll fix it later" item — forced the team to verify that the real JWT flow worked end‑to‑end. This gave us confidence that the security model is not just designed on paper, but actually functional in production.

- Bug fixing requires systematic prioritisation, not ad‑hoc patching. The issues with member cards (photo size, orientation, button positioning) seemed minor individually, but they had a cumulative negative effect on the user experience. Fixing them required a coordinated effort across frontend components, which reinforced the importance of maintaining a consistent UI component library.

- A broken CI/CD pipeline undermines everything else. Even with great tests and clean code, if deployment is unreliable, the team cannot deliver value to the customer. Fixing the deploy pipeline in Week 6 restored trust in the automation and made it possible to ship fixes quickly and confidently.

- Domain modelling matters for both code and organisation. Adding separate department/role fields for the CEO and assistant was not just a database change — it clarified the organisational structure of the Student Union in the system. This made access control more precise and helped users understand who is responsible for what.

## Validated assumptions

- Confirmed: the decision to use JWT for admin endpoints (ADR‑0001) was correct and scalable. Once the mock was removed, the real authentication flow worked as designed, proving that the architectural choice was sound.

- Confirmed: centralised configuration (ADR‑0003, Docker Compose + CI) makes pipeline fixes tractable. The deployment workflow was repairable because all the moving parts — compose files, environment variables, and deployment scripts — were documented and versioned.

- Confirmed: customer feedback from the Week 5 review directly informed Week 6 priorities. The member card issues and organisational clarity improvements came from real user input, which validated that we were working on the right things.

- Confirmed: the team can shift focus from greenfield development to polish and stabilisation without losing momentum. The transition from architecture and testing (Week 5) to bug fixing and pipeline hardening (Week 6) was smooth, indicating mature project management.

- Confirmed: removing old mocks is a necessary milestone for production readiness. The mock sign had been a placeholder for so long that the team almost forgot it was there — removing it forced a full verification of the authentication flow, which was a healthy "stress test" before delivery.

## Friction and gaps

- Bug fixes exposed deeper UI inconsistencies. While we fixed the member card issues, we noticed that other parts of the frontend (e.g., event cards, questionnaire forms) have similar minor styling inconsistencies that were not yet addressed. These will need attention during final polishing.

- Pipeline stability is restored, but not yet fully resilient. The CI/CD pipeline now runs reliably, but it is still somewhat brittle — for example, it depends on specific environment variables and external services being available. A future improvement would be to add better error handling and retry logic.

- The mobile version remained under‑prioritised. As noted in the Week 5 retrospective, mobile responsiveness was repeatedly postponed. In Week 6, the team focused on bug fixes and pipeline work, so mobile improvements did not make it into the sprint. This is a risk for the final handover, since many students access the portal from their phones.

- Removing the mock authentication required careful coordination. The mock was deeply integrated into the frontend development workflow (e.g., local development, smoke tests). Removing it meant updating several parts of the codebase and test fixtures.

## Planned response

- Dedicate the final sprint (Week 7) to mobile responsiveness. The mobile version must be brought to a usable state before handover, as it directly affects user adoption and satisfaction.

- Perform a full UI consistency audit. Before the final delivery, the team should go through all major pages (home, events, members, questionnaires, admin) and ensure styling is consistent across components and screen sizes.
