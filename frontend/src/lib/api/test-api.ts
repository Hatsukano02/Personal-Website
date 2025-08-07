// API 连接测试文件
// 用于验证 Strapi API 连接和数据获取

import { socialLinksService } from './services/socialLinks';
import { projectsService } from './services/projects';

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

// 测试 Projects API
export async function testProjectsAPI() {
  console.log('🚀 Testing Projects API...');
  
  try {
    // 测试获取所有项目
    console.log('📡 Fetching all projects...');
    const allProjects = await projectsService.getAll();
    console.log('✅ All projects:', allProjects);
    console.log(`📊 Total projects: ${allProjects.meta.pagination.total}`);

    // 测试获取精选项目
    console.log('📡 Fetching featured projects...');
    const featuredProjects = await projectsService.getFeatured();
    console.log('✅ Featured projects:', featuredProjects);
    console.log(`📊 Featured projects: ${featuredProjects.data.length}`);

    // 测试获取进行中的项目
    console.log('📡 Fetching in-progress projects...');
    const inProgressProjects = await projectsService.getInProgress();
    console.log('✅ In-progress projects:', inProgressProjects);

    // 如果有数据，测试单个项目获取
    if (allProjects.data.length > 0) {
      const firstProject = allProjects.data[0];
      console.log('📡 Fetching single project by ID...');
      const singleProject = await projectsService.getById(firstProject.id);
      console.log('✅ Single project:', singleProject);

      // 测试通过slug获取
      if (firstProject.slug) {
        console.log('📡 Fetching project by slug...');
        const projectBySlug = await projectsService.getBySlug(firstProject.slug);
        console.log('✅ Project by slug:', projectBySlug);
      }
    }

    return {
      success: true,
      data: {
        totalProjects: allProjects.meta.pagination.total,
        featuredProjects: featuredProjects.data.length,
        sampleData: allProjects.data.slice(0, 2) as unknown[], // 前两条数据作为示例
      },
    };

  } catch (error) {
    console.error('❌ Projects API test failed:', error);
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
    projects: await testProjectsAPI(),
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
    testProjectsAPI,
    testAPIConnection,
  };
  
  console.log('🛠️ API test functions available in browser console:');
  console.log('   window.testAPI.testSocialLinksAPI()');
  console.log('   window.testAPI.testProjectsAPI()');
  console.log('   window.testAPI.testAPIConnection()');
}