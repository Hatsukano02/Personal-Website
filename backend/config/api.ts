/**
 * Strapi 5.x API配置
 * 确保REST API正确暴露
 */

export default {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
    // 明确启用REST endpoints
    prefix: '/api',
  },
  // 确保响应格式正确
  responses: {
    privateAttributes: [],
  },
};
