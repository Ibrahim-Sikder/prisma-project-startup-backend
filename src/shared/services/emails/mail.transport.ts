import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import sendGridMail from '@sendgrid/mail';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@config/config';
import { Logger } from '@config/logger';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  private readonly log: Logger;

  constructor() {
    this.log = new Logger('MailTransport');
  }

  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentEmailSender(receiverEmail, subject, body);
    } else {
      this.productionEmailSender(receiverEmail, subject, body);
    }
  }

  private async developmentEmailSender(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const transporter: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL!,
        pass: config.SENDER_EMAIL_PASSWORD!,
      },
    });

    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      this.log.info('Development email sent successfully.');
    } catch (error) {
      this.log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private async productionEmailSender(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await sendGridMail.send(mailOptions);
      this.log.info('Production email sent successfully.');
    } catch (error) {
      this.log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
}

export const mailTransport: MailTransport = new MailTransport();
