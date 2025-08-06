'use client'

import { useState } from 'react';
import { testAPIConnection, testSocialLinksAPI } from '@/lib/api/test-api';

interface APITestResult {
  success: boolean;
  error?: string;
  data?: {
    totalLinks?: number;
    activeLinks?: number;
    sampleData?: unknown[];
  };
  details?: unknown;
}

export function APITestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<Record<string, APITestResult>>({});

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const testResults = await testAPIConnection();
      setResults(testResults);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleTestSocialLinks = async () => {
    setTesting(true);
    try {
      const result = await testSocialLinksAPI();
      setResults({ socialLinks: result });
    } catch (error) {
      console.error('Social Links test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleClearResults = () => {
    setResults({});
  };

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg font-mono text-sm"
      >
        {isOpen ? 'Close' : 'API Test'}
      </button>

      {/* 测试面板 */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              API Test Panel
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* 测试按钮 */}
          <div className="space-y-2 mb-4">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm"
            >
              {testing ? 'Testing...' : 'Test All APIs'}
            </button>
            
            <button
              onClick={handleTestSocialLinks}
              disabled={testing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm"
            >
              {testing ? 'Testing...' : 'Test Social Links'}
            </button>

            <button
              onClick={handleClearResults}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
            >
              Clear Results
            </button>
          </div>

          {/* 结果显示 */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Test Results:
              </h4>
              
              {Object.entries(results).map(([service, result]) => (
                <div key={service} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-semibold ${
                      result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.success ? '✅' : '❌'} {service}
                    </span>
                  </div>
                  
                  {result.success && result.data && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      {result.data.totalLinks !== undefined && (
                        <div>Total Links: {result.data.totalLinks}</div>
                      )}
                      {result.data.activeLinks !== undefined && (
                        <div>Active Links: {result.data.activeLinks}</div>
                      )}
                      {result.data.sampleData && (
                        <div>
                          Sample: {result.data.sampleData.map((item) => (item as { platform: string }).platform).join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!result.success && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* API 配置信息 */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>API URL: {process.env.NEXT_PUBLIC_API_URL}</div>
              <div>Environment: {process.env.NODE_ENV}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}