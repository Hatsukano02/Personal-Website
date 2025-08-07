#!/usr/bin/env node

/**
 * Fix Strapi 5.x API Routes
 * 
 * 问题：Strapi 5.x 内容类型创建后，REST API路由未自动生成
 * 解决：更新所有内容类型的schema.json，确保API正确配置
 */

const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src', 'api');

// 获取所有内容类型目录
const contentTypes = [
  'album',
  'blog-post',
  'media-work',
  'photo',
  'photo-album',
  'project',
  'social-link',
  'tag'
];

console.log('🔧 开始修复Strapi 5.x API路由配置...\n');

contentTypes.forEach(contentType => {
  const schemaPath = path.join(
    apiPath,
    contentType,
    'content-types',
    contentType,
    'schema.json'
  );

  if (!fs.existsSync(schemaPath)) {
    console.log(`❌ 找不到 ${contentType} 的schema文件`);
    return;
  }

  try {
    // 读取现有schema
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    // 确保有正确的pluginOptions配置
    if (!schema.pluginOptions) {
      schema.pluginOptions = {};
    }
    
    // 添加content-manager配置（确保在管理界面可见）
    schema.pluginOptions['content-manager'] = {
      visible: true
    };
    
    // 添加content-type-builder配置
    schema.pluginOptions['content-type-builder'] = {
      visible: true
    };
    
    // 确保options配置正确
    if (!schema.options) {
      schema.options = {};
    }
    
    // 设置draftAndPublish（根据需要调整）
    schema.options.draftAndPublish = true;
    
    // 移除所有属性中的configurable和private设置（这些在5.x中可能导致问题）
    Object.keys(schema.attributes).forEach(attrKey => {
      delete schema.attributes[attrKey].configurable;
      delete schema.attributes[attrKey].private;
    });
    
    // 写回文件
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    console.log(`✅ 修复 ${contentType} schema配置`);
    
  } catch (error) {
    console.error(`❌ 处理 ${contentType} 时出错:`, error.message);
  }
});

console.log('\n📝 现在更新路由文件...\n');

// 更新路由文件，确保使用正确的配置
contentTypes.forEach(contentType => {
  const routePath = path.join(apiPath, contentType, 'routes', `${contentType}.js`);
  
  if (!fs.existsSync(routePath)) {
    console.log(`❌ 找不到 ${contentType} 的路由文件`);
    return;
  }
  
  // 创建新的路由配置（带有完整选项）
  const routeContent = `"use strict";

/**
 * ${contentType} router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::${contentType}.${contentType}", {
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    create: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    update: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    delete: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },
});
`;

  fs.writeFileSync(routePath, routeContent);
  console.log(`✅ 更新 ${contentType} 路由配置`);
});

console.log('\n✨ 修复完成！请重启Strapi服务器。');
console.log('运行: npm run develop');
