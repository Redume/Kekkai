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
						},
						{
							label: 'Get currency rate - /api/getRate',
							slug: 'docs/endpoints/getrate'
						},
						{
							label: 'Create charts - /api/getChart',
							slug: 'docs/endpoints/create-chart'
						},
						{
							label: 'Get metadata - /api/metadata',
							slug: 'docs/endpoints/metadata'
						}
					],
				},
				{
					label: 'Config',
					items: [
						{
							label: 'Configure .env',
							slug: 'docs/config/config-env'
						},
						{
							label: 'Configure config.hjson',
							slug: 'docs/config/config-hjson'
						},
						{
							label: 'Configure Nginx',
							slug: 'docs/config/config-nginx'
						}
					],
				},
			],
		}),
	],
});
