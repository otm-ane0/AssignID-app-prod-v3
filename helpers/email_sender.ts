import 'dotenv/config'
import VERIFICATION_EMAIL_TEMPLATE from './verify_template'

const sendMail = async (details: any) => {
  const url = 'https://api.emailit.com/v1/emails';
  const apiKey = process.env["EMAILIT_KEY"];

  const emailData = {
    from: details.fromEmail?`${details.fromEmail.split('@')[1].split('.')[0]} <${details.fromEmail}>` : 'noreplay <noreply@loginsign.com>',
    to: details.to,
    reply_to: details.fromEmail || 'noreply@loginsign.com',
    subject: details.subject,
    html: details.html,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const sendMail_ = async (details: any) => {
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      headers: {
        accept: 'application/json',
        'api-key': process.env['EMAIL_API_KEY'],
        'content-type': 'application/json',
      } as any,
      method: 'POST',
      body: JSON.stringify({
        sender: {
          name: details.fromName || 'LoginSign',
          email: details.fromEmail || 'noreply@loginsign.com',
        },
        to: [
          {
            email: details.to,
          },
        ],
        subject: details.subject,
        htmlContent: details.html,
      }),
    })
    return r
  } catch (error) {
    console.log('email send error ::: ', error)
  }
}

const sendVerificationEmail = async (
  email: string,
  token: string,
  code: string,
  fromEmail?:string,
  emailTemplate?: string,
) => {
  let r = await sendMail({
    to: email,
    subject: 'Verification Code',
    text: 'Verify your email',
    fromEmail: fromEmail,
    html: emailTemplate ? emailTemplate.replace('{{OTP}}', `${token}_${code}`) : VERIFICATION_EMAIL_TEMPLATE(code, token),
  })
  if (r) {
    console.log('response status :: ', r)
  }
}

export { sendVerificationEmail }
