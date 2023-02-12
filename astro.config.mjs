import { defineConfig } from 'astro/config'
//import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind'
import solidJs from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [
    //react(),
    tailwind(),
    solidJs(),
  ],
})
