import { relations } from 'drizzle-orm';
import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { init } from '@paralleldrive/cuid2';
const createId = init({ length: 10 });

const getId = () =>
	text('id')
		.primaryKey()
		.$defaultFn(() => createId());

export const key = sqliteTable('key', {
	id: text('id').primaryKey(), // google:userId
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password')
});

export const keyRelations = relations(key, ({ one }) => ({
	user: one(user, {
		fields: [key.userId],
		references: [user.id]
	})
}));

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username'),
	role: text('role', { enum: ['user', 'admin', 'student', 'teacher', 'osteopath'] }).default(
		'user'
	),
	state: text('state'),
	name: text('name'),
	email: text('email'),
	image: text('image'),
	phone_number: text('phone_number'),
	phone_number_verified: integer('phone_number_verified', { mode: 'boolean' }).default(false),
	bio: text('bio')
});

// export type NewUser = typeof user.$inferInsert; // insert type
export type User = typeof user.$inferSelect; // return type when queried

export const userRelations = relations(user, ({ one, many }) => ({
	osteopath: one(osteopath, {
		fields: [user.id],
		references: [osteopath.userId]
	}),
	keys: many(key)
}));

export const osteopath = sqliteTable('osteopath', {
	id: getId(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const osteopathRelations = relations(osteopath, ({ one, many }) => ({
	user: one(user, {
		fields: [osteopath.userId],
		references: [user.id]
	}),
	appointments: many(appointment),
	availability: many(availability)
}));

export const availability = sqliteTable('availability', {
	id: getId(),
	day: text('day', {
		enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'friday', 'thursday', 'saturday']
	}),
	startTime: text('start_time', { mode: 'text' }),
	endTime: text('end_time', { mode: 'text' }),
	osteopathId: text('osteopath_id')
		.notNull()
		.references(() => osteopath.id)
});

export const availabilityRelations = relations(availability, ({ one }) => ({
	osteopath: one(osteopath, {
		fields: [availability.osteopathId],
		references: [osteopath.id]
	})
}));

export const appointment = sqliteTable('appointment', {
	id: getId(),
	date: text('date'),
	startTime: text('start_at'),
	duration: text('duration').default('30'),
	// adding applicants columns user[] -> defined action of osteopath to user as patient
	userId: text('user_id').references(() => user.id),
	osteopathId: text('osteopath_id')
		.notNull()
		.references(() => osteopath.id)
});

export const appointmentRelations = relations(appointment, ({ one }) => ({
	user: one(user, {
		fields: [appointment.userId],
		references: [user.id]
	}),
	osteopath: one(osteopath, {
		fields: [appointment.osteopathId],
		references: [osteopath.id]
	})
}));
