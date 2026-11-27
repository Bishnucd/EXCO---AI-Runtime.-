/**
 * Sanitizes HTML strings generated from Markdown before passing to dangerouslySetInnerHTML.
 * Strips dangerous elements, inline event handlers, and unsafe URL schemes.
 */

const BLOCKED_TAGS = new Set([
  'script',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
  'style',
  'link',
  'meta',
  'base',
  'svg',
  'math',
]);

const URL_ATTRS = new Set(['href', 'src', 'xlink:href', 'action', 'formaction', 'poster']);

function isSafeUrl(raw: string): boolean {
  const trimmed = raw.replace(/[\u0000-\u0020]+/g, '').toLowerCase();
  if (!trimmed) return true;
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
    return true;
  }
  if (trimmed.startsWith('data:image/')) {
    return !trimmed.startsWith('data:image/svg');
  }
  return false;
}

export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return '';
  if (typeof DOMParser === 'undefined') {
    return dirtyHtml.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  const doc = new DOMParser().parseFromString(dirtyHtml, 'text/html');
  const walk = (node: Element) => {
    const children = Array.from(node.children);
    for (const child of children) {
      const tag = child.tagName.toLowerCase();
      if (BLOCKED_TAGS.has(tag)) {
        child.remove();
        continue;
      }

      for (const attr of Array.from(child.attributes)) {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || name === 'srcdoc') {
          child.removeAttribute(attr.name);
          continue;
        }
        if (URL_ATTRS.has(name) && !isSafeUrl(attr.value)) {
          child.removeAttribute(attr.name);
        }
      }

      if (tag === 'a') {
        child.setAttribute('rel', 'noopener noreferrer');
      }

      walk(child);
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
}
