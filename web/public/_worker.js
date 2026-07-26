const CANONICAL_HOST = "codexpet.top";
const REDIRECT_HOSTS = new Set([
  "www.codexpet.top",
  "awesome-codex-pet.pages.dev",
]);

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (REDIRECT_HOSTS.has(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      return Response.redirect(url, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
