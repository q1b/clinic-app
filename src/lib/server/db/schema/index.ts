import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: varchar('id', {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  // other user attributes
  username: text('username'),
  name: text('name'),
  email: text('email'),
  image: text('image'),
});

export const keys = pgTable('key', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  }).notNull(),
  // .references(() => user.id),
  hashedPassword: varchar('hashed_password', {
    length: 255,
  }),
});

// Note: PlanetScale does not support foreign keys, that's why the references() method is commented out.
