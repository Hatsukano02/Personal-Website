// 调试 API 连接的简单工具

import axios from 'axios';

// 最基础的连接测试
export async function testBasicConnection() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  
  console.log('🔍 Testing basic connection to:', baseURL);
  
  try {
    // 1. 测试基础连接
    console.log('📡 Step 1: Testing basic GET request...');
    const response = await axios.get(`${baseURL}/social-links`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Success:', response.status, response.statusText);
    console.log('📊 Data:', response.data);
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      url: `${baseURL}/social-links`
    };
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    
    if (error.response) {
      console.error('📋 Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('📋 Request error:', {
        message: 'No response received',
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      console.error('📋 Setup error:', error.message);
    }
    
    return {
      success: false,
      error: error.message,
      details: error,
      url: `${baseURL}/social-links`
    };
  }
}

// 测试CORS预检请求
export async function testCORS() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  
  console.log('🌐 Testing CORS...');
  
  try {
    const response = await fetch(`${baseURL}/social-links`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ CORS test success:', response.status);
    const data = await response.json();
    console.log('📊 CORS Data:', data);
    
    return {
      success: true,
      status: response.status,
      data
    };
    
  } catch (error) {
    console.error('❌ CORS test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 测试所有可能的端点
export async function testAllEndpoints() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  const endpoints = [
    '/',
    '/social-links',
    '/social-link', // 可能是单数形式
    '/projects', 
    '/project', // 可能是单数形式
    '/blog-posts',
    '/blog-post',
    '/content-manager/collection-types',
  ];
  
  console.log('🔍 Testing all possible endpoints...');
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const url = endpoint === '/' ? baseURL.replace('/api', '') : `${baseURL}${endpoint}`;
      console.log(`📡 Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.text();
      results[endpoint] = {
        status: response.status,
        statusText: response.statusText,
        data: data.length > 200 ? data.substring(0, 200) + '...' : data
      };
      
      console.log(`${response.ok ? '✅' : '❌'} ${endpoint}: ${response.status}`);
      
    } catch (error) {
      results[endpoint] = {
        error: error.message
      };
      console.error(`❌ ${endpoint}: ${error.message}`);
    }
  }
  
  return results;
}

// 挂载到window对象供调试使用
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAPI = {
    testBasicConnection,
    testCORS,
    testAllEndpoints,
  };
  
  console.log('🛠️ Debug API functions available:');
  console.log('   window.debugAPI.testBasicConnection()');
  console.log('   window.debugAPI.testCORS()');
  console.log('   window.debugAPI.testAllEndpoints()');
}