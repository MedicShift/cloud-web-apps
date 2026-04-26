import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
    port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DATABASE_URL ? undefined : process.env.DB_USER || 'medicshift_user',
    password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || 'medicshift_password',
    database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'medicshift_db',
    ssl: process.env.DB_SSL === 'true' || process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
    autoLoadEntities: true,
    synchronize: false, // Migrations will handle schema updates
  }),
);
