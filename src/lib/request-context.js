/**
 * The four browser signals every CAPI event wants, read off the incoming
 * request. Vercel's edge populates x-forwarded-for; _fbc and _fbp are Meta's
 * own first-party cookies and attach automatically because every route that
 * calls this is same-origin with the page that triggered it.
 */
export function readRequestContext(req) {
  return {
    fbc: req.cookies.get('_fbc')?.value || '',
    fbp: req.cookies.get('_fbp')?.value || '',
    clientIp:
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '',
    clientUserAgent: req.headers.get('user-agent') || '',
  };
}
