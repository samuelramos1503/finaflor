export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const response = await env.ASSETS.fetch(new URL('/index.html', request.url));
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      return new Response(response.body, { status: response.status, headers: newHeaders });
    }
    return env.ASSETS.fetch(request);
  }
};
