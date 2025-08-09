export default () => ({
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['firstName', 'lastName', 'phone'], // Strapi 5中必须明确指定
      },
      ratelimit: {
        interval: 60000,
        max: 10,
      },
    },
  },
});
