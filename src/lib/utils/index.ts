import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function extractFromEmail(email_id: string | undefined | null) {
    let group;
    if(!(typeof email_id === 'string')) return 
    const regrex = /(?<name>\w+)\.(?<meta>\w+)@(?<university>\w+)\.edu\.in/
    group = email_id.match(regrex)?.groups
    if(!group) return
    const { name,meta } = group
    const reg = /(?:[a-zA-Z])+(?<year>\d{4})(?<batch>(?:[a-zA-Z])+)/
    group = meta.match(reg)?.groups;
    if(!group) return
    const { year, batch } = group
    return { name,meta,year,batch }
}

export function removeValue<T>(source: T[], target: T): T[] {
	const index = source.indexOf(target);
	if (index !== -1) {
		source.splice(index, 1);
	}
	return source;
}

export function hasValue<T>(source: undefined | T | T[], target: T): boolean {
	return (!Array.isArray(source) && source === target) || (Array.isArray(source) && source?.includes(target));
}

export const localStorage = {
  getItem(key: string) {
    try {
      // eslint-disable-next-line
      return window.localStorage.getItem(key);
    } catch (e) {
      // In case storage is restricted. Possible reasons
      // 1. Third Party Context in Chrome Incognito mode.
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      // eslint-disable-next-line
      window.localStorage.setItem(key, value);
    } catch (e) {
      // In case storage is restricted. Possible reasons
      // 1. Third Party Context in Chrome Incognito mode.
      // 2. Storage limit reached
      return;
    }
  },
};