import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    console.log("\n🔧 === Strapi Register Phase ===");
    console.log("Register phase starting...");
    
    // 在这个阶段，Strapi正在注册所有组件
    // 确保所有API路由和服务都被正确注册
    
    console.log("Available content types during register:");
    console.log(Object.keys(strapi.contentTypes || {}).filter(key => key.startsWith('api::')));
    
    console.log("Register phase completed");
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log("\n🚀 === Strapi Bootstrap Starting ===");
    
    // 检查数据库连接状态
    console.log("🔌 Checking database connection...");
    try {
      await strapi.db.connection.raw("SELECT 1 as test");
      console.log("✅ Database connection successful");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error; // 阻止启动继续进行
    }

    // 调试：检查Strapi内部状态
    console.log("\n🔍 === Strapi Internal State Debug ===");
    console.log(
      "Content Types:",
      Object.keys(strapi.contentTypes || {}).filter((key) =>
        key.startsWith("api::")
      )
    );

    // 检查特定内容类型
    console.log("\n📦 Album content type check:");
    console.log(
      "Album content type exists:",
      !!strapi.contentTypes?.["api::album.album"]
    );

    // 检查API服务是否存在
    try {
      const albumService = strapi.service("api::album.album");
      console.log("Album service exists:", !!albumService);
      if (albumService) {
        console.log("Album service methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(albumService)));
      }
    } catch (e) {
      console.log("Album service error:", (e as Error).message);
    }

    // 简化权限配置 - 移除复杂的重试逻辑避免连接池问题
    console.log("\n🔧 Configuring Public role permissions (simplified)...");
    try {
      // 简单查询公共角色，不进行重试
      const publicRole = await strapi.db
        .query("plugin::users-permissions.role")
        .findOne({
          where: { type: "public" },
        });

      if (!publicRole) {
        console.log("⚠️ Public role not found - will configure manually in Admin Panel");
        return;
      }

      console.log("✅ Found public role:", publicRole.name);
      console.log("ℹ️ Please configure API permissions manually in Admin Panel → Settings → Users & Permissions → Roles → Public");

    } catch (error) {
      console.error("❌ Error finding public role:", error.message);
      console.log("⚠️ Please configure permissions manually in Admin Panel");
    }

    console.log("🏁 Bootstrap completed\n");
  },
};
