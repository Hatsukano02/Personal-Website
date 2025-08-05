"use client";

export default function InsetShadowTest() {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-4">
      {/* 测试1: 内发光效果 - 小范围 */}
      <div 
        className="w-20 h-20 bg-gray-800 rounded-lg"
        style={{
          boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.3)'
        }}
      >
        <span className="text-xs text-white">Glow 1</span>
      </div>
      
      {/* 测试2: 内发光效果 - 中等范围 */}
      <div 
        className="w-20 h-20 bg-gray-800 rounded-lg"
        style={{
          boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.2)'
        }}
      >
        <span className="text-xs text-white">Glow 2</span>
      </div>
      
      {/* 测试3: 内发光效果 - 大范围 */}
      <div 
        className="w-20 h-20 bg-gray-800 rounded-lg"
        style={{
          boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.15)'
        }}
      >
        <span className="text-xs text-white">Glow 3</span>
      </div>
      
      {/* 测试4: 组合效果 - 内发光 + 外阴影 */}
      <div 
        className="w-20 h-20 bg-gray-800 rounded-lg"
        style={{
          boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.25), 0 10px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <span className="text-xs text-white">Both</span>
      </div>
    </div>
  );
}