export default (config: any, { strapi }: { strapi: any }) => {
  return (ctx: any, next: any) => {
    // 自定义安全策略配置
    ctx.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "connect-src 'self' https:; " +
      "img-src 'self' data: blob: https:; " +
      "media-src 'self' data: blob:; " +
      "upgrade-insecure-requests;"
    );
    
    return next();
  };
};