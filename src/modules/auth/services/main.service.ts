import { BadRequestException, Injectable } from '@nestjs/common';
import { IMailService } from '../interfaces/mail-service.interface';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MainService implements IMailService {
  constructor(private readonly config : ConfigService){}
  private getTransporter() {
    return nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.config.get('SMTP_EMAIL'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }
  async sendOtpEmail(email: string, code: string): Promise<void> {
     try {
      const transporter = this.getTransporter();
      const fromEmail = this.config.get<string>('SMTP_EMAIL');
      if (!fromEmail) {
        throw new Error('Internal Server Error: Email configuration is missing.');
      }
      await transporter.sendMail({
        from: `"Dada" <${fromEmail}>`,
        to: email,
        subject:'Password Reset Code',
        html:`
        <h2>Password Reset</h2>
        <p>Your OTP code is:</p>
        <h1>${code}</h1>
        <p>This code will expire in 5 minutes.</p>
      `,
      });
    } catch (error) {
      console.error('Email sending error:', error);
     
      throw new BadRequestException('Failed to send email. Please try again later.');
    }
  }
}
