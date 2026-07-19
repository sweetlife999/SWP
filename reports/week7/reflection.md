# Reflection — Week 7

## Learning points

- Removing all mock data is crucial for production readiness. Eliminating the remaining mock data in Week 7 forced comprehensive testing of real API integrations, ensuring that the portal functions correctly with actual backend services rather than simulated responses.

- Bug fixing in the final sprint requires attention to both user-facing and administrative interfaces. Addressing typing issues in kanban, events, and members admin pages improved the administrator experience, while fixing donation page and questionnaire rendering enhanced the end-user experience.

- Data visualization components need careful validation across different states. Fixing the pie chart rendering for questionnaires ensured that data is presented accurately and usefully to administrators reviewing survey results.

- Conditional visibility logic improves user experience by reducing clutter. Hiding survey drafts from the menu when questionnaire answers exist and archived events from default users streamlines navigation and prevents confusion.

## Validated assumptions

- Confirmed: the decision to eliminate all mock data before handover was correct. This forced verification of real API endpoints and gave confidence that the system works with actual data rather than simulations.

- Confirmed: addressing UI issues in administrative interfaces (kanban, events, members) directly improves the customer's ability to manage the portal post-handover, making the system more maintainable.

- Confirmed: fixing data visualization components (pie charts) ensures administrators can trust the data presented, which is essential for informed decision-making based on survey results.

- Confirmed: implementing conditional visibility logic based on data state improves user experience by showing only relevant information, reducing cognitive load.

- Confirmed: allocating time in the final sprint for both bug fixes and feature enhancements (like new Kanban board views) allows for a balanced approach to polishing the product while adding value.

## Friction and gaps

- Some UI inconsistencies may remain across different components and screen sizes. While major bugs were fixed, a comprehensive design audit might reveal minor styling inconsistencies that could benefit from additional attention.

- The two new Kanban board designs (List, Timeline) were added but may require user feedback to validate their usefulness and usability in real-world scenarios.

- Documentation updates for the final features and changes might need verification to ensure they accurately reflect the current state of the system for the customer team.

- Performance testing under realistic data loads was not explicitly mentioned in the sprint deliverables, which could be important for ensuring the system scales appropriately with actual usage.
