import { createTransport, SendMailOptions } from 'nodemailer';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

const getGetTransporter = () => {
  return createTransport({
    service: 'gmail',
    auth: {
      user: config.get(CONFIG_KEYS.GMAIL_EMAIL),
      pass: config.get(CONFIG_KEYS.GMAIL_APP_PASSWORD),
    },
  });
};

const getHtmlTemplate = (htmlBodyContent: string) => {
  return `
    <html>
      <head>
          <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
            }
            h2 {
                color: #285E61;
            }
            a {
                padding: 10px 20px;
                border-radius: 5px;
                color: #0000ff;
                text-decoration: none;
            }
          </style>
      </head>
      <body>
          <div class="container">
              ${htmlBodyContent}
          </div>
      </body>
    </html>
  `;
};

export const sendEmail = ({
  to,
  subject,
  htmlBodyContent,
}: {
  to: string;
  subject: string;
  htmlBodyContent: string;
}) => {
  const transporter = getGetTransporter();

  const mailOptions: SendMailOptions = {
    from: config.get(CONFIG_KEYS.GMAIL_EMAIL),
    to,
    subject,
    html: getHtmlTemplate(htmlBodyContent),
  };

  return transporter.sendMail(mailOptions);
};

export const sendVerificationEmailForStaff = async ({
  to,
  verificationLink,
}: {
  to: string;
  verificationLink: string;
}) => {
  const htmlBodyContent = `
    <h2>Vítejte v aplikaci Zohan! 🎉</h2>
    <p>Dobrý den,</p>
    <p>Děkujeme, že jste se zaregistrovali v aplikaci Zohan. Zbývá jen jeden krok od aktivace Vašeho účtu a nastavení vašeho prvního hesla. 👍</p>
    <b>
      <p>Pro aktivaci vašeho účtu prosím klikněte na následující odkaz:</p>
    </b>
    <hr/>
    <a href="${verificationLink}" target="_blank">👉 ${verificationLink}</a>
    <hr/>
    <p>Pokud jste se nezaregistrovali v aplikaci Zohan, ignorujte prosím tento e-mail.</p>
    <p>S pozdravem,</p>
    <p>Tým Zohan 👋</p>  
  `;

  await sendEmail({ to, htmlBodyContent, subject: 'Aktivace účtu' });
};

export const sendVerificationEmailForCustomer = async ({
  to,
  verificationLink,
}: {
  to: string;
  verificationLink: string;
}) => {
  const htmlBodyContent = `
    <h2>Vítejte v aplikaci Zohan! 🎉</h2>
    <p>Dobrý den,</p>
    <p>Děkujeme, že jste se zaregistrovali v aplikaci Zohan. Zbývá jen jeden krok od aktivace Vašeho účtu. 👍</p>
    <b>
      <p>Pro aktivaci vašeho účtu prosím klikněte na následující odkaz:</p>
    </b>
    <hr/>
    <a href="${verificationLink}" target="_blank">👉 ${verificationLink}</a>
    <hr/>
    <p><i>Odkaz vyprší za 7 dní.</i></p>
    <p>Pokud jste se nezaregistrovali v aplikaci Zohan, ignorujte prosím tento e-mail.</p>
    <p>S pozdravem,</p>
    <p>Tým Zohan 👋</p>  
  `;

  await sendEmail({ to, htmlBodyContent, subject: 'Aktivace účtu' });
};
