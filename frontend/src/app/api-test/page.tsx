'use client'

import { useState } from 'react'
import { testAPIConnection, testSocialLinksAPI, testProjectsAPI } from '@/lib/api/test-api'
import { testBasicConnection, testCORS, testAllEndpoints } from '@/lib/api/debug'

export default function APITestPage() {
  const [results, setResults] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(false)

  const runTest = async (testFn: () => Promise<unknown>, testName: string) => {
    setLoading(true)
    try {
      const result = await testFn()
      setResults(prev => ({ ...prev, [testName]: result }))
    } catch (error) {
      setResults(prev => ({ ...prev, [testName]: { error: String(error) } }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          API Test Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => runTest(testBasicConnection, 'basicConnection')}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            🔍 Basic Connection
          </button>

          <button
            onClick={() => runTest(testCORS, 'corsTest')}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            🌐 CORS Test
          </button>

          <button
            onClick={() => runTest(testAllEndpoints, 'allEndpoints')}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            🔍 All Endpoints
          </button>
          
          <button
            onClick={() => runTest(testSocialLinksAPI, 'socialLinks')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Test Social Links API
          </button>
          
          <button
            onClick={() => runTest(testProjectsAPI, 'projects')}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Test Projects API
          </button>
          
          <button
            onClick={() => runTest(testAPIConnection, 'all')}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Test All APIs
          </button>
          
          <button
            onClick={() => setResults({})}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Clear Results
          </button>
        </div>

        {loading && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 dark:text-yellow-200">Testing in progress...</p>
          </div>
        )}

        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {key} Results
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 overflow-x-auto text-sm">
              <code className="text-gray-800 dark:text-gray-200">
                {JSON.stringify(value, null, 2)}
              </code>
            </pre>
          </div>
        ))}

        <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            API Configuration
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'}</p>
            <p>Environment: {process.env.NODE_ENV}</p>
            <p>You can also test in browser console:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>window.testAPI.testSocialLinksAPI()</li>
              <li>window.testAPI.testProjectsAPI()</li>
              <li>window.testAPI.testAPIConnection()</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}