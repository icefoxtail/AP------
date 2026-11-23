"""Observer side of the optional plan field accessibilityDescription (stat, set, lattice and container figures). Wire-only helper: it never imports a producer module and
has its own copy of the rule (one non-blank line of at most 500 characters)."""
import xml.etree.ElementTree as ET

SVG = '{http://www.w3.org/2000/svg}'
MAX_LENGTH = 500


def description_valid(value):
    return isinstance(value, str) and value.strip() != '' and len(value) <= MAX_LENGTH and '\r' not in value and '\n' not in value


def audit_accessible_name(root, expected, forbid_when_absent=False):
    """Error codes for the drawn <title>/<desc> of a figure whose plan has (expected) or has not (None) an accessibilityDescription.
    With a description: role=img, aria-labelledby naming both ids, exactly one <title id=visual-title> with text and exactly one <desc id=visual-desc> whose text is the plan's line.
    Without one: nothing to check, except that a figure which never writes a name (forbid_when_absent) writes none."""
    titles = [e for e in root.iter(SVG + 'title')]
    descs = [e for e in root.iter(SVG + 'desc')]
    if expected is None:
        return ['A11Y_UNEXPECTED_NAME'] if forbid_when_absent and (titles or descs) else []
    errors = []
    if not description_valid(expected):
        return ['A11Y_DESCRIPTION_INVALID']
    if root.get('role') != 'img' or root.get('aria-labelledby') != 'visual-title visual-desc':
        errors.append('A11Y_NAME_BINDING')
    if len(titles) != 1 or titles[0].get('id') != 'visual-title' or not (titles[0].text or '').strip():
        errors.append('A11Y_TITLE')
    if len(descs) != 1 or descs[0].get('id') != 'visual-desc' or descs[0].text != expected:
        errors.append('A11Y_DESCRIPTION_MISMATCH')
    return errors
