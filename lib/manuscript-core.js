const EMAIL_MASK_PATTERN = / *<[^>\s]+@[^>\s]+>/g;
const HEADER_PATTERN = /^-{5,}[^\n]*\n(?:(?:From|Date|Subject|To):[^\n]*\n?)+/;

/**
 * Masks private email addresses and splits a manuscript into header/body
 * sections when it starts with a forwarded-email block.
 *
 * @param {string} raw
 * @returns {{ header: string | null; body: string }}
 */
function parseManuscript(raw) {
  const masked = raw.replace(EMAIL_MASK_PATTERN, '').trim();
  const match = masked.match(HEADER_PATTERN);

  if (!match) {
    return {
      header: null,
      body: masked,
    };
  }

  return {
    header: match[0].trim(),
    body: masked.slice(match[0].length).trim(),
  };
}

module.exports = {
  parseManuscript,
};
