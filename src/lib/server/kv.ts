import { Redis } from "@upstash/redis";
import * as env from "$env/static/private";
import { dev } from "$app/environment";

declare global {
	// eslint-disable-next-line no-var
	var __upstash_kv: import('@upstash/redis').Redis;
}

const upstashClient = new Redis({
  url: env.UPSTASH_URL,
  token: env.UPSTASH_TOKEN
});

if (dev) {
	globalThis.__upstash_kv = upstashClient;
}

export default upstashClient;