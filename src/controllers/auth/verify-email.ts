import joiRouter from 'koa-joi-router';

import { validateEmailVerificationToken } from '@utils/auth/email-validation';
import { User } from '@models/user';

const router = joiRouter();

router.route({
  path: '/verify-email',
  // use GET method to make browser access this route
  method: 'get',
  handler: [
    async (ctx) => {
      const { token } = ctx.request.query;

      let userId: string;

      try {
        if (typeof token !== 'string') {
          return ctx.throw(401, 'Token is not a string');
        }

        const tokenPayload = validateEmailVerificationToken(token);

        if (!tokenPayload) {
          return ctx.throw(401, 'Invalid token');
        }

        userId = tokenPayload.id;
      } catch (error) {
        return ctx.throw(401, error.message);
      }

      const user = await User.findById(userId);
      if (!user) {
        return ctx.throw(401, 'User not found');
      }

      user.status = 'verified';
      await user.save();

      ctx.body = `
        <html>
          <head>
            <title>ZOHAN - verifikace emailu</title>
          </head>
          <body>
            <h1>Váš email byl úspěšně ověřen</h1>
            <p>
              Nyní se můžete přihlásit do aplikace.
            </p>
          </body>
        </html>
      `;
    },
  ],
});

export default router;
