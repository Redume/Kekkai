// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Kekkai',
			social: { github: 'https://github.com/redume/kekkai' },
			editLink: { baseUrl: 'https://github.com/redume/kekkai/edit/main/docs/' },
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{
							label: 'Docker', 
							slug: 'docs/getting-started/docker', 
							badge: 'recommended',
						}, 
						{
							label: 'Contributing', slug: 'docs/getting-started/contributing'
						},
					],
				},
				{
					label: 'Endpoints',
					items: [
						{
							label: 'Endpoints list', slug: 'docs/endpoints/endpoints-list'
						}
					],
				},
			],
		}),
	],
});
