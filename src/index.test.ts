import DescopeStrategy from '.';

it('returns some properties', () => {
  expect(
    new DescopeStrategy({
      projectId: 'P2NyeltBwxXl01AO1zxIRoqusres',
      callbackUrl: '/auth/cb',
      verify: (payload, callback) => {
        callback(payload.destination);
      },
    }),
  ).toEqual({
    _options: {
      projectId: 'P2NyeltBwxXl01AO1zxIRoqusres',
      callbackUrl: '/auth/cb',
      verify: expect.any(Function),
    },
    _descopeClient: expect.any(Object),
    name: 'descope'
  });
});
