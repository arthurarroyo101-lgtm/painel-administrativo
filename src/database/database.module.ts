import { Global, Module } from '@nestjs/common';
import { db }             from './database';

export const DRIZZLE = Symbol('DRIZZLE');

@Global()
@Module({
  providers: [{ provide: DRIZZLE, useValue: db }],
  exports:   [DRIZZLE],
})
export class DatabaseModule {}
