export interface IPasswordResetService {
  requestReset(email: string): Promise<{ message: string; }>;
  resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ message: string }>;
}
