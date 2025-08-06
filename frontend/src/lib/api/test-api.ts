// API 连接测试文件
// 用于验证 Strapi API 连接和数据获取

import { socialLinksService } from './services/socialLinks';

// 测试 Social Links API
export async function testSocialLinksAPI() {
  console.log('🚀 Testing Social Links API...');
  
  try {
    // 测试获取所有社交链接
    console.log('📡 Fetching all social links...');
    const allLinks = await socialLinksService.getAll();
    console.log('✅ All social links:', allLinks);
    console.log(`📊 Total links: ${allLinks.meta.pagination.total}`);

    // 测试获取激活的社交链接
    console.log('📡 Fetching active social links...');
    const activeLinks = await socialLinksService.getActive();
    console.log('✅ Active social links:', activeLinks);
    console.log(`📊 Active links: ${activeLinks.data.length}`);

    // 如果有数据，测试单个链接获取
    if (activeLinks.data.length > 0) {
      const firstLink = activeLinks.data[0];
      console.log('📡 Fetching single link by ID...');
      const singleLink = await socialLinksService.getById(firstLink.id);
      console.log('✅ Single link:', singleLink);

      // 测试按平台获取
      console.log('📡 Fetching link by platform...');
      const platformLinks = await socialLinksService.getByPlatform(firstLink.platform);
      console.log('✅ Platform links:', platformLinks);
    }

    return {
      success: true,
      data: {
        totalLinks: allLinks.meta.pagination.total,
        activeLinks: activeLinks.data.length,
        sampleData: activeLinks.data.slice(0, 2) as unknown[], // 前两条数据作为示例
      },
    };

  } catch (error) {
    console.error('❌ Social Links API test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    };
  }
}

// 通用 API 连接测试
export async function testAPIConnection() {
  console.log('🔍 Testing API connection...');
  
  const results = {
    socialLinks: await testSocialLinksAPI(),
  };

  // 总结测试结果
  console.log('📋 API Test Summary:');
  Object.entries(results).forEach(([service, result]) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${service}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  });

  return results;
}

// 开发环境辅助函数：直接在浏览器控制台运行测试
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 将测试函数挂载到 window 对象，方便调试
  (window as unknown as { testAPI: unknown }).testAPI = {
    testSocialLinksAPI,
    testAPIConnection,
  };
  
  console.log('🛠️ API test functions available in browser console:');
  console.log('   window.testAPI.testSocialLinksAPI()');
  console.log('   window.testAPI.testAPIConnection()');
}