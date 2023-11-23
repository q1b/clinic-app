/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);

const ASSETS = [
	...build, // the app itself
	...staticAssets // everything in `static`
];

sw.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		await sw.skipWaiting();
	}

	event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
		sw.clients.claim();
	}

	event.waitUntil(deleteOldCaches());
});

// sw.addEventListener('fetch', (event) => {
// 	// ignore POST requests etc
// 	if (event.request.method !== 'GET') return;

// 	async function respond() {
// 		const url = new URL(event.request.url);
// 		const cache = await caches.open(CACHE);

// 		// `build`/`files` can always be served from the cache
// 		if (ASSETS.includes(url.pathname)) {
// 			const response = await cache.match(url.pathname);
// 			if (response) return response;
// 		}

// 		// for everything else, try the network first, but
// 		// fall back to the cache if we're offline
// 		try {
// 			const response = await fetch(event.request);
// 			if (response.status === 200) {
// 				cache.put(event.request, response.clone());
// 			}
// 			return response;
// 		} catch (err) {
// 			const response = await cache.match(event.request);
// 			if (response) return response;
// 			throw err;
// 		}
// 	}

// 	const respondValue = respond();
// 	event.respondWith(respondValue);
// });
