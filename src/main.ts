  import 'reflect-metadata';
  import { NestFactory }            from '@nestjs/core';
  import { ValidationPipe }         from '@nestjs/common';
  import { AppModule }              from './app.module';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Todas as rotas sob /api
    app.setGlobalPrefix('api');

    // Validação automática dos DTOs em todos os endpoints
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist:            true,  // remove campos não declarados no DTO
        forbidNonWhitelisted: true,  // rejeita requisições com campos extras
        transform:            true,  // converte tipos automaticamente
      }),
    );

    // CORS — permite chamadas autenticadas do frontend
    app.enableCors({
      origin:         process.env.FRONTEND_URL ?? 'http://localhost:5173',
      credentials:    true,
      methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const port = Number(process.env.PORT) || 3000;
    await app.listen(port);

    console.log(`AdminOS API     → http://localhost:${port}/api`);
    console.log(`  /api/users    → perfis, roles, ativar/desativar`);
    console.log(`  /api/roles    → CRUD de roles e permissões`);
  }

  bootstrap();
