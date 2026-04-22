export interface IPasswordResetService {
  requestReset(email: string): Promise<{ message: string; code: string }>;
  resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ message: string }>;
}
