import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 调试：检查Strapi内部状态
    console.log("\n🔍 === Strapi Internal State Debug ===");
    console.log(
      "Content Types:",
      Object.keys(strapi.contentTypes || {}).filter((key) =>
        key.startsWith("api::")
      )
    );
    console.log("Routes count:", strapi.server?.router?.stack?.length || 0);

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
    } catch (e) {
      console.log("Album service error:", (e as Error).message);
    }

    // 自动配置Public角色的API权限 - 延迟执行确保数据库连接就绪
    setTimeout(async () => {
      try {
        const publicRole = await strapi.db
          .query("plugin::users-permissions.role")
          .findOne({
            where: { type: "public" },
          });

        if (!publicRole) {
          console.log("⚠️ Public role not found");
          return;
        }

        // 需要开放的内容类型
        const contentTypes = [
          "api::social-link.social-link",
          "api::project.project",
          "api::album.album",
          "api::blog-post.blog-post",
          "api::media-work.media-work",
          "api::photo.photo",
          "api::photo-album.photo-album",
          "api::tag.tag",
        ];

        const existingPermissions = await strapi.db
          .query("plugin::users-permissions.permission")
          .findMany({
            where: { role: publicRole.id },
          });

        console.log("🔧 Configuring Public role permissions...");

        for (const contentType of contentTypes) {
          // 检查find权限
          const findPermission = existingPermissions.find(
            (p) => p.action === `${contentType}.find`
          );

          if (!findPermission) {
            await strapi.db
              .query("plugin::users-permissions.permission")
              .create({
                data: {
                  action: `${contentType}.find`,
                  subject: null,
                  properties: {},
                  conditions: [],
                  role: publicRole.id,
                },
              });
            console.log(`✅ Added ${contentType}.find permission`);
          }

          // 检查findOne权限
          const findOnePermission = existingPermissions.find(
            (p) => p.action === `${contentType}.findOne`
          );

          if (!findOnePermission) {
            await strapi.db
              .query("plugin::users-permissions.permission")
              .create({
                data: {
                  action: `${contentType}.findOne`,
                  subject: null,
                  properties: {},
                  conditions: [],
                  role: publicRole.id,
                },
              });
            console.log(`✅ Added ${contentType}.findOne permission`);
          }
        }

        console.log("🎉 Public role permissions configured successfully!");
      } catch (error) {
        console.error("❌ Error configuring permissions:", error);
      }
    }, 2000); // 延迟2秒执行
  },
};
