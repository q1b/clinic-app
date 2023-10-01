import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import {
    PUBLIC_CLOUDINARY_CLOUD_NAME,
    PUBLIC_CLOUDINARY_UPLOAD_PRESET
} from '$env/static/public';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};

// // extracting email address details
// export function extractFromEmail(email_id: string | undefined | null) {
//     let group;
//     if(!(typeof email_id === 'string')) return 
//     const regrex = /(?<name>\w+)\.(?<meta>\w+)@(?<university>\w+)\.edu\.in/
//     group = email_id.match(regrex)?.groups
//     if(!group) return
//     const { name,meta } = group
//     const reg = /(?:[a-zA-Z])+(?<year>\d{4})(?<batch>(?:[a-zA-Z])+)/
//     group = meta.match(reg)?.groups;
//     if(!group) return
//     const { year, batch } = group
//     return { name,meta,year,batch }
// }

export function isOsteopath(email_id: string | undefined | null) {
    if(!(typeof email_id === 'string')) return false 
    if(email_id.includes("sukhpreet.s")) return true
    const regrex = /(?<name>\w+)\.(?<meta>\w+)@(?<university>\w+)\.edu\.in/g
    const group = email_id.match(regrex)?.groups
    if(!group) return false
    const meta = group['meta']
    return meta.includes('mos') || meta.includes('bos')
}

// Uploading File utils
type ElEvent<T extends Event, E extends Element> = T & { currentTarget: EventTarget & E };

type UploadResponse = {
    fileName: string;
    url: string;
    message: string;
};

export type InputChangeEvent = ElEvent<Event, HTMLInputElement>

export async function uploadImage(
    event: InputChangeEvent
): Promise<UploadResponse> {
    return new Promise<UploadResponse>((resolve, reject) => {
        const selectedFile = event.currentTarget.files?.[0];
        if (!selectedFile) {
            reject({ message: 'No file selected' });
            return;
        }
        const fileName = selectedFile.name.split('.')[0] || '';
        const isImage = selectedFile.type.includes('image');
        const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert bytes to MB
        console.log(`File Size: ${fileSizeInMB}`);

        if (!isImage) {
            reject({ message: `Video is not supported` });
            return;
        }


        uploadFile(selectedFile)
            .then((url) => {
                if (url) {
                    resolve({ fileName, url, message: 'Image is Uploaded' });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const uploadFile = async (file: File): Promise<string | undefined> => {
    if (!file || (!file.type.includes('image') && !file.type.includes('video'))) {
        return undefined;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('upload_preset', PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', PUBLIC_CLOUDINARY_CLOUD_NAME);

    try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/${file.type.includes('image') ? 'image' : 'video'
            }/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
        const image = await res.json();
        return image.secure_url;
    } catch (err) {
        console.error(err);
        return undefined;
    }
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