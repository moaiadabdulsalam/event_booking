export interface IMailService {
  sendOtpEmail(email: string, code: string): Promise<void>;
}