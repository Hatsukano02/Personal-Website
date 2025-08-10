export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: any) => {
    const allowedOrigins = [
      'http://localhost:3000', // 开发环境前端
      'http://127.0.0.1:3000',
      'https://你的域名.com', // 生产环境域名
    ];
    
    const origin = ctx.get('Origin');
    
    if (allowedOrigins.includes(origin)) {
      ctx.set('Access-Control-Allow-Origin', origin);
    }
    
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
    ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    
    if (ctx.method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    
    await next();
  };
};