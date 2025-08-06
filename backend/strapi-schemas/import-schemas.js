#!/usr/bin/env node

/**
 * 批量导入 Strapi 内容类型配置
 * 基于 phase_2_1_config.md 自动生成所有内容类型
 */

const fs = require('fs');
const path = require('path');

const SCHEMAS_DIR = __dirname;
const API_DIR = path.join(__dirname, '..', 'src', 'api');

// 所有需要创建的内容类型
const contentTypes = [
  'social-link',
  'tag', 
  'blog-post',
  'photo',
  'photo-album',
  'project',
  'album',
  'media-work'
];

async function createContentType(typeName) {
  console.log(`📝 Creating content type: ${typeName}`);
  
  // 读取 JSON 配置
  const schemaPath = path.join(SCHEMAS_DIR, `${typeName}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  
  // 创建 API 目录结构
  const apiPath = path.join(API_DIR, typeName);
  const contentTypesPath = path.join(apiPath, 'content-types', typeName);
  const controllersPath = path.join(apiPath, 'controllers');
  const routesPath = path.join(apiPath, 'routes');
  const servicesPath = path.join(apiPath, 'services');
  
  // 创建目录
  [apiPath, contentTypesPath, controllersPath, routesPath, servicesPath].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // 生成 schema.json
  fs.writeFileSync(
    path.join(contentTypesPath, 'schema.json'),
    JSON.stringify(schema, null, 2)
  );
  
  // 生成默认控制器
  const controllerContent = `'use strict';

/**
 * ${typeName} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${typeName}.${typeName}');
`;
  
  fs.writeFileSync(
    path.join(controllersPath, `${typeName}.js`),
    controllerContent
  );
  
  // 生成默认路由
  const routeContent = `'use strict';

/**
 * ${typeName} router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::${typeName}.${typeName}');
`;
  
  fs.writeFileSync(
    path.join(routesPath, `${typeName}.js`),
    routeContent
  );
  
  // 生成默认服务
  const serviceContent = `'use strict';

/**
 * ${typeName} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${typeName}.${typeName}');
`;
  
  fs.writeFileSync(
    path.join(servicesPath, `${typeName}.js`),
    serviceContent
  );
  
  console.log(`✅ Created ${typeName} successfully`);
}

async function main() {
  console.log('🚀 Starting Strapi content types import...');
  console.log(`📁 Creating content types in: ${API_DIR}`);
  
  try {
    // 确保 API 目录存在
    if (!fs.existsSync(API_DIR)) {
      fs.mkdirSync(API_DIR, { recursive: true });
    }
    
    // 批量创建所有内容类型
    for (const typeName of contentTypes) {
      await createContentType(typeName);
    }
    
    console.log('');
    console.log('🎉 All content types created successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Restart Strapi server: npm run develop');
    console.log('2. Check admin panel: http://localhost:1337/admin');
    console.log('3. Add test data for Social Links');
    console.log('4. Test API endpoints');
    
  } catch (error) {
    console.error('❌ Error creating content types:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { createContentType, contentTypes };