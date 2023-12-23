import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGoogleTokens } from '$lib/server/kv';
import { getNums, getPlainDateTime } from '../utilts';
import calendarService from '$lib/server/calendar';
import { db } from '$lib/shared/db';
import { appointment } from '$lib/shared/db/schema';
import { eq } from 'drizzle-orm';
// import calendarService from '$lib/server/calendar';

export const POST: RequestHandler = async ({ request }) => {
  const appointmentData = await request.json();
  const duration = +`${appointmentData.duration || 30}`;
  const [year, month, day] = getNums(appointmentData.date, '-');
  const [hour, minute] = getNums(appointmentData.startTime, ':');
  const startTime = getPlainDateTime({ year, month, day, hour, minute });
  const endTime = startTime.add({
    minutes: duration
  });
  console.log('Updating Response');
  const upRes = await db
    .update(appointment)
    .set({
      userId: appointmentData.userId
    })
    .where(eq(appointment.id, appointmentData.id));
  console.log('UPDATE RES', upRes);
  const tokens = await getGoogleTokens(appointmentData.osteopathUserId);
  console.log("TOKENS", tokens)
  if (tokens?.access_token && tokens.refersh_token) {
    const calendar = calendarService({
      userId: appointmentData.osteopathUserId,
      access_token: tokens.access_token,
      refresh_token: tokens.refersh_token
    });
    const calendars = await calendar.getCalendar().catch((e) => console.log(e));
    if (calendars?.id) {
      console.log(
        'SENDING Request \n\n',
        JSON.stringify(
          {
            startTime: startTime.toString(),
            endTime: endTime.toString(),
            summary: `Osteopathy Session with ${appointmentData.userId}`,
            host: {
              email: appointmentData.osteopathEmail
            },
            nonHost: {
              email: appointmentData.userEmail
            }
          },
          null,
          2
        ),
        '\n\n'
      );
      const event = await calendar.createEvent(calendars.id, {
        startTime: startTime.toString(),
        endTime: endTime.toString(),
        summary: `Osteopathy Session with ${appointmentData.userId}`,
        host: {
          email: appointmentData.osteopathEmail
        },
        nonHost: {
          email: appointmentData.userEmail
        }
      });
      console.log('Submitted', event);
      if (event?.id && event.attendees) {
        console.log('SENDING UPDATE EVENT');
        const attendeeIndex = event.attendees?.findIndex(
          (attendee) => attendee.email === appointmentData.osteopathEmail
        );
        if (attendeeIndex)
          event.attendees[attendeeIndex] = {
            ...event.attendees[attendeeIndex],
            responseStatus: 'accepted'
          };
        const rsvp = await calendar.updateEvent(calendars.id, event?.id, event);
        console.log('\n\nUPDATED', rsvp);
      } else {
        // TODO: Add Exception statement
      }
    }
    console.log(calendars);
  }
  return json(appointmentData);
};
