"""Small helpers shared between kanban.py and kanban_automations.py.

Split out (rather than importing one router from the other) to avoid a
circular import: kanban.py calls into kanban_automations.run_automations()
after a card write, and kanban_automations.py needs the same assignee-color
and initials logic kanban.py already had as private helpers.
"""

ASSIGNEE_COLORS = [
    "linear-gradient(135deg,#a3e0ad,#32b247)",
    "linear-gradient(135deg,#a8c0e0,#3868b8)",
    "linear-gradient(135deg,#e0a8c8,#c93f8b)",
    "linear-gradient(135deg,#f6d365,#fda085)",
]


def initials(name: str) -> str:
    """Avatar initials from a free-text assignee: first letter of each word
    (up to 3); a blind slice would garble multi-word names."""
    parts = name.split()
    if len(parts) > 1:
        return "".join(p[0] for p in parts[:3]).upper()
    return name[:3].upper()
