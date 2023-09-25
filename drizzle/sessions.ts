import { Redis } from "@upstash/redis";
import * as dotenv from "dotenv"
dotenv.config();

const upstashClient = new Redis({
  url: process.env.UPSTASH_URL as string,
  token: process.env.UPSTASH_TOKEN as string
});
