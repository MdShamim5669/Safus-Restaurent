import { resend } from '../../config/resend';

export interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  from = 'onboarding@resend.dev',
}: ISendEmailOptions) => {
  const result = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  return result;
};
