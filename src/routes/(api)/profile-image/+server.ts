import type { RequestHandler } from "@sveltejs/kit";
import cloudinary from "$lib/server/cloudinary";
import { auth } from "$lib/server/lucia";

export const POST:RequestHandler = (async ({ request, locals }) => {
  const { userId, url } = await request.json();
  const res = await auth.updateUserAttributes(userId,{
    image: url
  })
  locals.auth.invalidate()
  console.log( "Database is Updated", res )
  return new Response(JSON.stringify({ message: "Thing deleted" }));
}) satisfies RequestHandler;


export const DELETE = (async ({ request }) => {
  const publicId = await request.json();
  await cloudinary.uploader.destroy(publicId.id as string);
  return new Response(JSON.stringify({ message: "Thing deleted" }));
}) satisfies RequestHandler;