# 登录系统集成指南

## 📋 概述

已完成登录页面的前端实现并集成后端真实 API，包含登录和注册功能。

## ✅ 最新更新 (2025-11-03)

### 已集成真实后端 API

根据 `auth_demo.html` 中的接口实现，已完成以下集成：

1. **登录接口** - ✅ 已集成
   - 使用 OAuth2 Password Flow
   - Content-Type: `application/x-www-form-urlencoded`
   - 使用 `username` 字段（而非 email）

2. **注册接口** - ✅ 已集成
   - Content-Type: `application/json`
   - 支持 `username`, `email`, `password`, `full_name`

3. **用户信息接口** - ✅ 已集成
   - JWT Bearer Token 认证
   - 返回完整用户信息

4. **Token 刷新** - ✅ 已集成
   - 自动刷新过期 Token
   - 保存新的 access_token 和 refresh_token

---

## 📁 文件结构

### 设计风格
- ✅ 与项目其他页面保持一致的温暖自然风格
- ✅ 使用项目设计系统的颜色和字体
- ✅ HappyWoods Logo 集成
- ✅ 流畅的动画效果（Framer Motion）
- ✅ 响应式设计

### 功能特性
- ✅ **登录/注册模式切换** - 同一页面平滑切换
- ✅ **表单验证** - 前端基础验证（邮箱格式、密码长度等）
- ✅ **密码显示/隐藏** - 眼睛图标切换
- ✅ **加载状态** - 提交时显示"处理中..."
- ✅ **错误提示** - 实时表单错误显示
- ✅ **返回主页** - 左上角链接
- ✅ **忘记密码** - 预留入口（待实现）

---

## 📁 文件结构

```
client/src/
├── app/
│   └── login/
│       └── page.tsx          # 登录页面主文件
│
└── lib/
    └── api-service.ts        # API 服务（包含认证相关函数）
```

---

## 🔌 API 集成说明

### 当前状态

所有认证相关的 API 函数已在 `api-service.ts` 中定义，目前使用模拟实现。

### 需要后端提供的接口

#### 1. 登录接口

**端点**: `POST /api/v1/auth/login`

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "username": "张三",
    "email": "user@example.com"
  }
}
```

**失败响应** (401):
```json
{
  "success": false,
  "message": "邮箱或密码错误"
}
```

---

#### 2. 注册接口

**端点**: `POST /api/v1/auth/register`

**请求体**:
```json
{
  "username": "张三",
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应** (201):
```json
{
  "success": true,
  "message": "注册成功"
}
```

**失败响应** (400):
```json
{
  "success": false,
  "message": "邮箱已被注册"
}
```

---

#### 3. Token 验证接口（可选）

**端点**: `GET /api/v1/auth/verify`

**请求头**:
```
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "username": "张三",
    "email": "user@example.com"
  }
}
```

---

## 🔧 集成步骤

### 1. 修改 `api-service.ts` 中的登录函数

找到 `login` 函数，取消注释真实实现，删除模拟代码：

```typescript
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '登录失败');
  }

  const data: AuthResponse = await response.json();

  // 保存 token 到 localStorage
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_info', JSON.stringify(data.user));
  }

  return data;
}
```

### 2. 修改 `register` 函数

类似登录函数，取消注释真实实现：

```typescript
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '注册失败');
  }

  return await response.json();
}
```

### 3. 更新登录页面的 API 调用

在 `login/page.tsx` 的 `handleSubmit` 函数中，已经集成了 `api-service`，只需导入并调用：

```typescript
import { login, register } from '@/lib/api-service';

// 在 handleSubmit 中
try {
  if (mode === 'login') {
    const result = await login({
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      router.push('/notion-ai');
    }
  } else {
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      setMode('login');
      // 显示成功提示
    }
  }
} catch (error) {
  // 显示错误提示
  console.error('认证错误:', error);
}
```

---

## 🔐 Token 管理

### 存储方式

Token 存储在 `localStorage` 中：

```javascript
// 登录成功后
localStorage.setItem('auth_token', token);
localStorage.setItem('user_info', JSON.stringify(userInfo));

// 获取 token
const token = localStorage.getItem('auth_token');

// 登出时清除
localStorage.removeItem('auth_token');
localStorage.removeItem('user_info');
```

### 在 API 请求中使用 Token

修改其他 API 请求，添加认证头：

```typescript
import { getAuthToken } from '@/lib/api-service';

const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/chat/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,  // ← 添加这行
  },
  body: JSON.stringify(data)
});
```

---

## 🛡️ 路由保护（推荐）

### 创建认证中间件

创建 `middleware.ts` 用于保护需要登录的路由：

```typescript
// client/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  
  // 需要保护的路由
  const protectedPaths = ['/notion-ai', '/ai-workflow'];
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // 如果访问受保护路由但未登录，重定向到登录页
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/notion-ai/:path*', '/ai-workflow/:path*']
};
```

### 创建认证 Hook（推荐）

创建 `use-auth.ts` hook 方便在组件中使用：

```typescript
// client/src/hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout } from '@/lib/api-service';

export function useAuth() {
  const [user, setUser] = useState(getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    setUser(getCurrentUser());
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return {
    user,
    isLoggedIn,
    logout: handleLogout
  };
}
```

使用示例：

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isLoggedIn, logout } = useAuth();
  
  if (!isLoggedIn) {
    return <div>请先登录</div>;
  }
  
  return (
    <div>
      <p>欢迎, {user?.username}</p>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

---

## 🎯 测试清单

### 前端功能测试

- [ ] 登录表单验证（邮箱格式、密码长度）
- [ ] 注册表单验证（用户名、密码确认）
- [ ] 登录/注册模式切换
- [ ] 密码显示/隐藏切换
- [ ] 加载状态显示
- [ ] 错误提示显示
- [ ] 返回主页链接

### API 集成测试

- [ ] 登录成功 - Token 保存到 localStorage
- [ ] 登录失败 - 显示错误信息
- [ ] 注册成功 - 自动切换到登录
- [ ] 注册失败 - 显示错误信息（邮箱已存在等）
- [ ] 登出 - 清除 Token 和用户信息

### 用户流程测试

- [ ] 新用户注册 → 登录 → 访问 AI 对话
- [ ] 已有用户登录 → 访问 AI 对话
- [ ] 未登录访问受保护页面 → 重定向到登录
- [ ] 登出 → 再次访问受保护页面 → 重定向到登录

---

## 🚀 访问登录页面

### 开发环境

```bash
http://localhost:3000/login
```

### 路由配置

已创建的路由：
- `/login` - 登录/注册页面
- `/` - 主页（可添加"登录"按钮）
- `/notion-ai` - AI 对话（建议添加登录保护）

---

## 📊 后续优化建议

### 短期（1-2周）

1. **接入真实后端 API**
   - 替换模拟实现
   - 处理真实的错误响应

2. **完善错误处理**
   - Toast 提示组件
   - 更友好的错误信息

3. **添加表单验证增强**
   - 邮箱实时验证
   - 密码强度指示器

### 中期（1个月）

4. **忘记密码功能**
   - 发送重置邮件
   - 重置密码页面

5. **记住我功能**
   - 7天自动登录
   - Refresh Token

6. **社交登录**
   - GitHub OAuth
   - Google OAuth

### 长期（2-3个月）

7. **双因素认证（2FA）**
   - TOTP 验证
   - 短信验证码

8. **用户个人中心**
   - 修改密码
   - 个人信息编辑

---

## 🔗 相关文档

- [API 手册](./api手册.md)
- [Session ID 管理](./SESSION-ID-MANAGEMENT.md)
- [快速启动指南](./快速启动指南.md)

---

## 📞 联系方式

如有问题或需要协助集成，请联系：
- **前端负责人**: [您的联系方式]
- **后端负责人**: [后端负责人联系方式]

---

**最后更新**: 2025-11-03  
**状态**: ✅ 前端完成，待后端接口集成
