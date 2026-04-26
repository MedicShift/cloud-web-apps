import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  passwordPepper:
    process.env.PASSWORD_PEPPER || 'default_pepper_change_in_prod',
  lockoutThreshold: parseInt(process.env.LOCKOUT_THRESHOLD || '5', 10),
  lockoutDurationMinutes: parseInt(
    process.env.LOCKOUT_DURATION_MINUTES || '15',
    10,
  ),
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_change_in_prod',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
}));
