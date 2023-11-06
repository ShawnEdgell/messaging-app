// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'fallback.html' // Add a fallback for dynamic routes
    }),
    // ... other options
  }
};
