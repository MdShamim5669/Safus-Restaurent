import { resend } from '../../config/resend';
import { ISendEmailOptions } from '../../interfaces';

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
