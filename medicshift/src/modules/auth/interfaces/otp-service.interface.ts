/**
 * IOtpService — Interface for future MFA/2FA integration.
 *
 * When implementing MFA, create a concrete OtpService that implements
 * this interface and register it in the AuthModule. Integration options:
 * - TOTP (Time-based One-Time Password) via `otplib` or `speakeasy`
 * - SMS OTP via Twilio
 * - Email OTP via SendGrid/SES
 */
export interface IOtpService {
  /** Generate and persist a new OTP for the given user */
  generateOtp(userId: string): Promise<string>;

  /** Verify the user-provided OTP against the stored one */
  verifyOtp(userId: string, otp: string): Promise<boolean>;

  /** Invalidate any existing OTP for the user (e.g., after successful verification or expiry) */
  invalidateOtp(userId: string): Promise<void>;
}

/** Injection token for OTP service */
export const OTP_SERVICE = Symbol('OTP_SERVICE');
