import MagicLinkStrategy from '.';

it('returns some properties', () => {
  expect(
    new MagicLinkStrategy({
      secret: 'asdf',
      callbackUrl: '/auth/magiclink/callback',
      confirmUrl: '/auth/magiclink/confirm',
      sendMagicLink: async (destination, href) => {
        // eslint-disable-next-line no-console
        console.log(
          destination,
          `Click this link to finish logging in: https://yourcompany.com${href}`,
        );
      },
      verify: (payload, callback) => {
        callback(payload.destination);
      },
    }),
  ).toEqual({
    _options: {
      callbackUrl: '/auth/magiclink/callback',
      confirmUrl: '/auth/magiclink/confirm',
      secret: 'asdf',
      sendMagicLink: expect.any(Function),
      verify: expect.any(Function),
    },
    confirm: expect.any(Function),
    name: 'magiclogin',
    send: expect.any(Function),
  });
});
