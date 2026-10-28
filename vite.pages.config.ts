// Static build for GitHub Pages (https://<user>.github.io/<repo>/).
// Lovable keeps using vite.config.ts; this file is only used by .github/workflows/pages.yml.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const base = process.env.PAGES_BASE ?? "/";

export default defineConfig({
  // No Cloudflare worker bundle: Pages serves plain files.
  cloudflare: false,
  tanstackStart: {
    router: { basepath: base },
    prerender: { enabled: true, crawlLinks: true },
  },
  vite: { base },
});
