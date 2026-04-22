export interface IOtpService {
  create(userId: string, purpose: string): Promise<string>;
  verify(userId: string, code: string, purpose: string): Promise<boolean>;
}