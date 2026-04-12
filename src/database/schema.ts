import {
  pgTable,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * Tabela user.
 *
 * Campos obrigatórios confirmados via getAuthTables() do Better Auth 1.6:
 *   name, email, emailVerified, image, createdAt, updatedAt
 *
 * Campos customizados do AdminOS:
 *   githubId, githubUsername, role, active
 */
export const user = pgTable('user', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image:         text('image'),
  createdAt:     timestamp('created_at').notNull(),
  updatedAt:     timestamp('updated_at').notNull(),

  // Campos customizados — registrados em user.additionalFields no auth.ts
  githubId:       text('github_id').unique(),
  githubUsername: text('github_username').unique(),
  role:           text('role').notNull().default('viewer'),
  active:         boolean('active').notNull().default(true),
});

/**
 * Tabela session.
 * Campos obrigatórios: expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId.
 */
export const session = pgTable('session', {
  id:        text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token:     text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId:    text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

/**
 * Tabela account — vincula contas OAuth ao usuário.
 * Better Auth armazena accountId = ID numérico do GitHub aqui.
 */
export const account = pgTable('account', {
  id:                    text('id').primaryKey(),
  accountId:             text('account_id').notNull(),
  providerId:            text('provider_id').notNull(),
  userId:                text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken:           text('access_token'),
  refreshToken:          text('refresh_token'),
  idToken:               text('id_token'),
  accessTokenExpiresAt:  timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope:                 text('scope'),
  password:              text('password'),
  createdAt:             timestamp('created_at').notNull(),
  updatedAt:             timestamp('updated_at').notNull(),
});

/**
 * Tabela verification — usada internamente pelo Better Auth
 * para e-mail verification, magic links, etc.
 */
export const verification = pgTable('verification', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expires_at').notNull(),
  createdAt:  timestamp('created_at'),
  updatedAt:  timestamp('updated_at'),
});

export type User    = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
