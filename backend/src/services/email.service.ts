import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"AI Hiring Platform" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
      });
      
      logger.info(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      logger.error('Email sending failed:', error);
      return false;
    }
  }

  async sendApplicationReceived(candidateName: string, candidateEmail: string, jobTitle: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Application Received</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for applying to the <strong>${jobTitle}</strong> position.</p>
        <p>Your application has been successfully submitted and is under review by our recruitment team.</p>
        <p>You can track your application status by logging into your dashboard.</p>
        <br>
        <p>Best regards,<br>AI Hiring Platform Team</p>
      </div>
    `;
    
    await this.sendEmail({
      to: candidateEmail,
      subject: `Application Received - ${jobTitle}`,
      html,
    });
  }

  async sendApplicationStatusUpdate(
    candidateName: string,
    candidateEmail: string,
    jobTitle: string,
    status: string
  ) {
    const statusMessages: Record<string, string> = {
      VIEWED: 'Your application is currently being reviewed by our team.',
      SHORTLISTED: 'Congratulations! You have been shortlisted for the next round.',
      SELECTED: 'Congratulations! You have been selected for this position. Our team will contact you soon.',
      REJECTED: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.',
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Application Status Update</h2>
        <p>Dear ${candidateName},</p>
        <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
        <p><strong>Current Status:</strong> ${status}</p>
        <p>${statusMessages[status] || 'Your application status has been updated.'}</p>
        <p>You can view more details by logging into your dashboard.</p>
        <br>
        <p>Best regards,<br>AI Hiring Platform Team</p>
      </div>
    `;
    
    await this.sendEmail({
      to: candidateEmail,
      subject: `Application Update - ${jobTitle}`,
      html,
    });
  }

  async sendNewApplicationNotification(
    recruiterName: string,
    recruiterEmail: string,
    candidateName: string,
    jobTitle: string
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Application Received</h2>
        <p>Dear ${recruiterName},</p>
        <p>A new application has been received for your job posting:</p>
        <ul>
          <li><strong>Job Title:</strong> ${jobTitle}</li>
          <li><strong>Candidate:</strong> ${candidateName}</li>
        </ul>
        <p>Log in to your dashboard to review the application and candidate's profile.</p>
        <br>
        <p>Best regards,<br>AI Hiring Platform Team</p>
      </div>
    `;
    
    await this.sendEmail({
      to: recruiterEmail,
      subject: `New Application - ${jobTitle}`,
      html,
    });
  }

  async sendWelcomeEmail(name: string, email: string, role: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to AI Hiring Platform!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering as a ${role.toLowerCase()} on our platform.</p>
        ${role === 'RECRUITER' 
          ? '<p>You can now start posting jobs and managing applications.</p>'
          : '<p>You can now start browsing job opportunities and applying to positions.</p>'
        }
        <p>Log in to your dashboard to get started!</p>
        <br>
        <p>Best regards,<br>AI Hiring Platform Team</p>
      </div>
    `;
    
    await this.sendEmail({
      to: email,
      subject: 'Welcome to AI Hiring Platform',
      html,
    });
  }
}

export const emailService = new EmailService();
