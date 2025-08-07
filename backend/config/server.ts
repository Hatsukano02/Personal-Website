export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // 添加webhooks配置
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // API配置
  api: {
    rest: {
      prefix: '/api',
      defaultLimit: 25,
      maxLimit: 100,
      withCount: true,
    },
  },
  // 确保公共访问
  public: {
    path: './public',
    maxAge: 60000,
  },
});
