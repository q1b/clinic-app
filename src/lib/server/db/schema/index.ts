import { relations } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  // other user attributes
  // username: text('username'),
  name: text('name'),
  email: text('email'),
  image: text('image'),
  phone_number: text('phone_number'),
  bio: text('bio').default('')
});

export type User = typeof user.$inferSelect; // return type when queried
// export type NewUser = typeof user.$inferInsert; // insert type

export const userRelations = relations(user, ({ many }) => ({
  keys: many(key),
}));

export const key = sqliteTable('key', {
  id: text('id').primaryKey(),
  userId: text('user_id', {
    length: 15,
  }).notNull()
    .references(() => user.id),
  hashedPassword: text('hashed_password'),
});

export const keyRelations = relations(key, ({ one }) => ({
  user: one(user, {
    fields: [key.userId],
    references: [user.id],
  }),
}))
