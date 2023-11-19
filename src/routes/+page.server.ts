import { db } from "$lib/server/db";
import { Temporal } from "@js-temporal/polyfill";
import type { PageServerLoad } from "./$types";
import { and, gte, isNull } from "drizzle-orm";
import { appointment } from "$lib/server/db/schema";

export const load: PageServerLoad = async (event) => {
  const today = Temporal.Now.plainDateISO().toLocaleString('en',{ year: 'numeric', month: '2-digit', day:'2-digit' });
  const [month,day,year] = today.split('/');
  const t = `${year}-${month}-${day}`
  // where: and(isNull(appointment.userId), gte(appointment.date,t))
  const osteopaths = await db.query.osteopath.findMany({
    with: {
      user: true,
      appointments: true
    }
  })
  return {
    osteopaths
  }
};