import { betterAuth }     from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { jwt }            from 'better-auth/plugins/jwt';
import { db }             from '../database/database';
import * as schema        from '../database/schema';

/**
 * Instância Better Auth — singleton compartilhado pelo main.ts
 * (middleware Express) e pelo SessionGuard (validação de token).
 *
 * Rotas criadas automaticamente em /api/auth/**:
 *   POST /api/auth/sign-in/social          → inicia OAuth GitHub
 *   GET  /api/auth/callback/github         → callback do GitHub
 *   POST /api/auth/sign-out                → encerra sessão
 *   GET  /api/auth/get-session             → dados da sessão atual
 *   GET  /api/auth/token                   → troca sessão por JWT (plugin jwt)
 */
export const auth = betterAuth({
  secret:  process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.APP_URL ?? 'http://localhost:3000',
  basePath: '/api/auth',

  // Drizzle adapter aponta para as 4 tabelas do schema
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user:         schema.user,
      session:      schema.session,
      account:      schema.account,
      verification: schema.verification,
    },
  }),

  // GitHub OAuth — scope user:email para garantir e-mail mesmo se privado
  socialProviders: {
    github: {
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope:        ['user:email'],

      /**
       * Mapeia o perfil do GitHub para os campos customizados.
       * Executado na criação E em cada login (mantém dados atualizados).
       */
      mapProfileToUser: (profile: Record<string, unknown>) => ({
        githubId:       String(profile['id']),
        githubUsername: String(profile['login']),
      }),
    },
  },

  // Plugin JWT — adiciona GET /api/auth/token
  // Troca o cookie de sessão por um JWT assinado válido por 7 dias
  plugins: [
    jwt({
      jwt: {
        expirationTime: '7d',
        issuer:         'adminOS',
        audience:       'adminOS-panel',
      },
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24,     // renova se tiver > 1 dia
    cookieCache: {
      enabled: true,
      maxAge:  60 * 5,           // cache local de 5 min (menos queries)
    },
  },

  // Informa ao Better Auth os tipos e defaults dos campos customizados
  user: {
    additionalFields: {
      githubId:       { type: 'string', required: false, unique: true },
      githubUsername: { type: 'string', required: false, unique: true },
      role:           { type: 'string', defaultValue: 'viewer' },
      active:         { type: 'boolean', defaultValue: true },
    },
  },

  trustedOrigins: [
    process.env.FRONTEND_URL ?? 'http://localhost:5173',
  ],
});
