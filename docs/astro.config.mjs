// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Kekkai',
			social: {
				github: 'https://github.com/redume/kekkai',
			},
			sidebar: [],
		}),
	],
});
