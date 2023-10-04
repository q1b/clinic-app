import { db } from "$lib/server/db";
import { availability, osteopath } from "$lib/server/db/schema/index";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import type { Actions } from './$types';
import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia";

export const load: PageServerLoad = async (event) => {
  const osteopathId = event.params.id;
  const data = await db.query.osteopath.findFirst({
    where: eq(osteopath.id, osteopathId),
    with: {
      user:true,
      appointments: true,
      availability: true,
    }
  })
  if(data?.availability.length === 0) {
    data.availability = await db.insert(availability).values([
      {
        osteopathId: osteopathId,
        day: 'sunday',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        osteopathId: osteopathId,
        day: 'monday',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        osteopathId: osteopathId,
        day: 'tuesday',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        osteopathId: osteopathId,
        day: 'wednesday',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        osteopathId: osteopathId,
        day: 'thursday',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        osteopathId: osteopathId,
        day: 'friday',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        osteopathId: osteopathId,
        day: 'saturday',
        startTime: '09:00',
        endTime: '17:00',
      },
    ]).returning()
  }
  return {
    osteopath: {
      name: data?.user.name,
      availability: data?.availability,
      appointments: data?.appointments,
      id:data?.id,
    }
  }
};


export const actions = {
  default: async ({ params, request, locals }) => {
    const data = await request.formData();
    const userId = params.id;
    const name = data.get('name');
    const bio = data.get('bio');
    const contact = data.get('contact-number');
    console.log("NAME", name);
    console.log("BIO", bio);
    console.log("CONTACT", contact);
    try {
      const res = await auth.updateUserAttributes(userId, {
        name: name?.toString(),
        phone_number: contact?.toString(),
        bio: bio?.toString(),
      });
      locals.auth.invalidate()
      return { success: true, values: res };
    } catch (e) {
      if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
        return { message: 'invalid user id' }
      }
      // provided user attributes violates database rules (e.g. unique constraint)
      // or unexpected database errors
      return { message: 'unexpected database errors' }
    }
  },
} satisfies Actions;