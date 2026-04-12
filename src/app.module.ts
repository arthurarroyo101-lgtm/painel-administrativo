import { Module }         from '@nestjs/common';
import { ConfigModule }   from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule }     from './auth/auth.module';
import { UsersModule }    from './users/users.module';
import { RolesModule }    from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule, // adminAuth + adminDb injetáveis globalmente
    AuthModule,     // AuthGuard + CurrentUser decorator
    UsersModule,    // /api/users/**
    RolesModule,    // /api/roles/**
  ],
})
export class AppModule {}
