import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'a', 'blockquote', 'span', 'div',
  'input', // checklist/todo items (BlockNote), always rendered disabled — inert, no script risk
];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'style', 'type', 'checked', 'disabled'];

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
