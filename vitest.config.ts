import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    browser: false,
    silent: true,
    cache: {
      dir: resolve(__dirname, '.vitest', 'cache'),
    },
    threads: true,
  },
});
