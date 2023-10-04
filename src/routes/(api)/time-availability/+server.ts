import { db } from "$lib/server/db";
import { availability } from "$lib/server/db/schema";
import type { RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = (async ({ request, locals }) => {
  const { startTime, endTime, day, osteopathId } = await request.json();
  try {
    const data = await db.insert(availability).values({
      day,
      startTime,
      endTime,
      osteopathId,
    }).returning()
    return new Response(JSON.stringify({ message: "ADDED", data: data[0] }));
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed", error:true }));
  }
}) satisfies RequestHandler;

export const PUT: RequestHandler = (async ({ request, locals }) => {
  const { startTime, endTime, id } = await request.json();
  console.log("STARTTIME",startTime,"ENDTIME",endTime,"ID",id);
  try {
    const data = await db.update(availability).set({
      startTime,
      endTime
    }).where(eq(availability.id,id));
    return new Response(JSON.stringify({ message: "Updated", data: { startTime, endTime } }));
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed", error:true }));
  }
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
  const { id } = await request.json();
  try {
    const data = await db.delete(availability).where(eq(availability.id,id)).returning();
    return new Response(JSON.stringify({ message: "DELETED", data}));
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed", error:true }));
  }
}) satisfies RequestHandler;