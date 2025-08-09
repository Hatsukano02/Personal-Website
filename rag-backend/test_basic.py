#!/usr/bin/env python3
"""
基础功能测试脚本
用于验证AI聊天机器人后端基础功能
"""

import asyncio
import json
import os
from pathlib import Path
import httpx

# 测试配置
BASE_URL = "http://localhost:8000"
API_PREFIX = "/api/v1"

async def test_health_check():
    """测试健康检查端点"""
    print("🔍 测试健康检查...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BASE_URL}{API_PREFIX}/health")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ 健康检查成功: {data['status']}")
                print(f"   依赖服务: {data['dependencies']}")
                return True
            else:
                print(f"❌ 健康检查失败: {response.status_code}")
                print(f"   响应: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ 健康检查异常: {e}")
            return False

async def test_chat_endpoint():
    """测试聊天端点"""
    print("\n💬 测试聊天端点...")
    
    # 测试消息
    test_messages = [
        {"message": "你好", "language": "zh"},
        {"message": "Hello", "language": "en"},
        {"message": "你能做什么？", "language": "zh"}
    ]
    
    session_id = None
    success_count = 0
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for i, msg in enumerate(test_messages):
            try:
                # 如果有会话ID，继续使用
                if session_id:
                    msg["session_id"] = session_id
                
                print(f"   发送消息 {i+1}: {msg['message']}")
                
                response = await client.post(
                    f"{BASE_URL}{API_PREFIX}/chat",
                    json=msg,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    session_id = data.get("session_id")
                    
                    print(f"   ✅ 响应: {data['response'][:50]}...")
                    print(f"   📊 Token使用: {data.get('token_usage', {})}")
                    success_count += 1
                    
                elif response.status_code == 429:
                    print(f"   ⚠️  限流: {response.json()}")
                    break
                    
                else:
                    print(f"   ❌ 聊天失败: {response.status_code}")
                    print(f"   响应: {response.text}")
                    
                # 短暂延迟避免限流
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"   ❌ 聊天异常: {e}")
    
    print(f"\n📈 聊天测试结果: {success_count}/{len(test_messages)} 成功")
    return success_count > 0

async def test_session_management():
    """测试会话管理"""
    print("\n🗂️  测试会话管理...")
    
    async with httpx.AsyncClient() as client:
        try:
            # 创建会话
            chat_response = await client.post(
                f"{BASE_URL}{API_PREFIX}/chat",
                json={"message": "测试会话", "language": "zh"}
            )
            
            if chat_response.status_code != 200:
                print(f"❌ 创建会话失败: {chat_response.status_code}")
                print(f"   响应内容: {chat_response.text}")
                return False
                
            session_id = chat_response.json().get("session_id")
            print(f"✅ 创建会话: {session_id}")
            
            # 获取会话信息
            session_info_response = await client.get(
                f"{BASE_URL}{API_PREFIX}/chat/sessions/{session_id}"
            )
            
            if session_info_response.status_code == 200:
                session_info = session_info_response.json()
                print(f"✅ 获取会话信息: {session_info['session_info']['message_count']} 条消息")
            else:
                print(f"❌ 获取会话信息失败: {session_info_response.status_code}")
            
            # 清除会话
            clear_response = await client.delete(
                f"{BASE_URL}{API_PREFIX}/chat/{session_id}"
            )
            
            if clear_response.status_code == 200:
                print(f"✅ 清除会话成功")
                return True
            else:
                print(f"❌ 清除会话失败: {clear_response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ 会话管理异常: {e}")
            return False

async def test_api_documentation():
    """测试API文档"""
    print("\n📚 测试API文档...")
    
    async with httpx.AsyncClient() as client:
        try:
            # 测试Swagger UI
            swagger_response = await client.get(f"{BASE_URL}/docs")
            if swagger_response.status_code == 200:
                print("✅ Swagger UI可访问")
            else:
                print(f"❌ Swagger UI不可访问: {swagger_response.status_code}")
            
            # 测试OpenAPI schema
            openapi_response = await client.get(f"{BASE_URL}/openapi.json")
            if openapi_response.status_code == 200:
                print("✅ OpenAPI schema可访问")
                return True
            else:
                print(f"❌ OpenAPI schema不可访问: {openapi_response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ API文档测试异常: {e}")
            return False

async def check_environment():
    """检查环境配置"""
    print("🔧 检查环境配置...")
    
    # 检查.env文件
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env文件存在")
        
        # 检查关键配置
        with open(env_file, 'r') as f:
            env_content = f.read()
            
        if "OPENAI_API_KEY=" in env_content and "your_openai_api_key_here" not in env_content:
            print("✅ OpenAI API Key已配置")
        else:
            print("⚠️  OpenAI API Key未正确配置")
            
        return True
    else:
        print("❌ .env文件不存在")
        print("   请复制 .env.example 为 .env 并配置相关参数")
        return False

async def main():
    """主测试函数"""
    print("🚀 开始测试AI聊天机器人后端基础功能\n")
    
    # 检查环境
    env_ok = await check_environment()
    if not env_ok:
        print("\n❌ 环境配置检查失败，请先配置环境变量")
        return
    
    # 检查服务是否运行
    print(f"\n🌐 检查服务连接 ({BASE_URL})...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(BASE_URL)
            if response.status_code == 200:
                print("✅ 服务可访问")
            else:
                print(f"⚠️  服务状态异常: {response.status_code}")
    except Exception as e:
        print(f"❌ 无法连接服务: {e}")
        print("   请确保后端服务正在运行:")
        print("   uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        return
    
    # 运行测试
    tests = [
        ("健康检查", test_health_check),
        ("聊天功能", test_chat_endpoint),
        ("会话管理", test_session_management),
        ("API文档", test_api_documentation)
    ]
    
    results = []
    for test_name, test_func in tests:
        result = await test_func()
        results.append((test_name, result))
    
    # 输出测试结果
    print("\n" + "="*50)
    print("📊 测试结果汇总")
    print("="*50)
    
    success_count = 0
    for test_name, result in results:
        status = "✅ 通过" if result else "❌ 失败"
        print(f"{test_name}: {status}")
        if result:
            success_count += 1
    
    print(f"\n总计: {success_count}/{len(results)} 测试通过")
    
    if success_count == len(results):
        print("\n🎉 所有测试通过！后端基础功能正常")
    else:
        print(f"\n⚠️  {len(results) - success_count} 个测试失败，请检查相关功能")

if __name__ == "__main__":
    asyncio.run(main())