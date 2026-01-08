import adapter from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: sequence([
        sveltePreprocess({
            scss: {
                silenceDeprecations: ['legacy-js-api']
            }
        }),
        preprocessMeltUI()
    ]),
    compilerOptions: {
        accessors: !!process.env.VITEST
    },

    kit: {
        alias: {
            $routes: './src/routes',
            $themes: './src/themes'
        },
        adapter: adapter({
            fallback: 'index.html',
            precompress: true
        }),
        paths: {
            base: process.env.PREVIEW ? '' : '/console',
            // Required for PostHog session replay to work correctly with SSR
            relative: false
        }
    },
    vitePlugin: {
        inspector: {
            toggleKeyCombo: 'meta-shift-i'
        }
    }
};

export default config;
