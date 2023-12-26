import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import type { Key } from 'lucia';
import { auth } from '$lib/server/lucia';
import { createId } from '@paralleldrive/cuid2';
import { db } from '$lib/shared/db';
import { osteopath as osteopathTable, user } from '$lib/shared/db/schema/index.js';
import { eq } from 'drizzle-orm';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  create: async (event) => {
    const formData = await event.request.formData();
    // Create Key and User, If Osteopath connect User to Osteopath
    const fullName = formData.get('full-name')!;
    const phoneNumber = formData.get('phone-number')!;
    const password = formData.get('password')!;
    const isOsteopath = formData.get('is-osteopath')! !== null;
    // console.log(fullName.toString(),phoneNumber.toString(),password.toString(),isOsteopath)
    if (phoneNumber === null) return fail(404, { error: 'Phone Number has Null Value' });
    if (password === null) return fail(404, { error: 'Password has Null Value' });
    console.log(phoneNumber.toString());
    let key: Key | null = null;
    const to = phoneNumber.toString().includes('+91') ? phoneNumber.toString() : `+91${phoneNumber.toString()}`;
    try {
      key = await auth.getKey('sms', to);
    } catch (error) {
      console.log(error);
    }
    if (key !== null) return fail(404, { error: 'User Already Exist In Database' });
    const id = createId();
    const userCreated = await auth.createUser({
      attributes: {
        id,
        phone_number: to,
        phone_number_verified: true,
        username: null,
        name: fullName.toString(),
        email: null,
        image: null,
        bio: null
      },
      key: {
        password: password.toString(),
        providerId: 'sms',
        providerUserId: to
      },
      userId: id
    });
    if (isOsteopath) {
      db.insert(osteopathTable).values({
        userId: id
      })
    }
    return { data: userCreated }
  },
  upgrade: async (event) => {
    const formData = await event.request.formData();
    const userId = formData.get('user-id');
    let osteopathId;
    try {
      console.log(userId)
      if (userId) {
        console.log('Creating Osteopath Account');
        const res = await db
          .insert(osteopathTable)
          .values({
            userId: userId.toString()
          })
          .returning();
        osteopathId = res[0].id;
        await auth.updateUserAttributes(userId.toString(), {
          role: 'osteopath'
        })
      }
    } catch (error) {
      console.log(error)
    }
    return { osteopathId }
  },
  update: async (event) => {
    const formData = await event.request.formData();
    const userId = formData.get('user-id');
    try {
      console.log(userId)
      // TODO: Fix SQLITE_CONSTRAINT: SQLite error: FOREIGN KEY constraint failed ERROR
      if (userId) await db.delete(user).where(eq(user.id, userId.toString()))
    } catch (error) {
      console.log(error)
    }
  },
  delete: async (event) => {
    const formData = await event.request.formData();
    const userId = formData.get('user-id');
    try {
      console.log(userId)
      // TODO: Fix SQLITE_CONSTRAINT: SQLite error: FOREIGN KEY constraint failed ERROR
      if (userId) await db.delete(user).where(eq(user.id, userId.toString()))
    } catch (error) {
      console.log(error)
    }
  }
} satisfies Actions;
