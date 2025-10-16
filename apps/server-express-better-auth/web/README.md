# Better Auth Web Application

这是一个基于 React + TypeScript + Vite 的现代化认证前端应用，与 better-auth 后端服务集成。

## 功能特性

- 🔐 用户登录（用户名/密码）
- 📝 用户注册
- 👤 用户主页（显示用户信息）
- 🛡️ 路由保护
- 📱 响应式设计
- 🎨 现代化 UI（基于 shadcn/ui）

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS
- **UI 组件**: shadcn/ui + Radix UI
- **路由**: React Router DOM
- **HTTP 客户端**: Fetch API
- **图标**: Lucide React

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ui/             # UI 组件（shadcn/ui）
│   └── ProtectedRoute.tsx  # 路由保护组件
├── contexts/           # React 上下文
│   └── AuthContext.tsx # 认证上下文
├── lib/                # 工具函数
│   └── utils.ts        # 通用工具
├── pages/              # 页面组件
│   ├── LoginPage.tsx   # 登录页面
│   ├── RegisterPage.tsx # 注册页面
│   └── UserHomePage.tsx # 用户主页
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## API 集成

应用通过以下 API 端点与 better-auth 后端通信：

- `POST /api/auth/sign-in/username-password` - 用户登录
- `POST /api/auth/sign-up` - 用户注册
- `GET /api/auth/session` - 获取当前会话
- `POST /api/auth/sign-out` - 用户登出

## 环境变量

创建 `.env` 文件并配置以下变量（可选）：

```env
VITE_API_URL=http://localhost:3000
```

## 功能说明

### 认证流程

1. **登录**: 用户输入用户名和密码，验证成功后跳转到用户主页
2. **注册**: 新用户创建账户，自动登录并跳转到用户主页
3. **会话管理**: 自动检查用户会话状态，保持登录状态
4. **路由保护**: 未登录用户无法访问受保护页面

### 用户界面

- **登录页面**: 简洁的登录表单，支持跳转到注册页面
- **注册页面**: 用户注册表单，包含密码确认验证
- **用户主页**: 显示用户基本信息和快速操作选项

### 错误处理

- 登录失败显示错误消息
- 注册失败显示具体错误原因
- 网络错误和用户友好的错误提示

## 开发说明

### 添加新页面

1. 在 `src/pages/` 目录创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 如需保护路由，使用 `ProtectedRoute` 组件包装

### 修改认证逻辑

认证逻辑主要在 `src/contexts/AuthContext.tsx` 中管理，包括：

- 登录/注册函数
- 会话检查
- 用户状态管理

### 样式定制

- 全局样式在 `src/index.css` 中配置
- TailwindCSS 配置在 `tailwind.config.js` 中
- UI 组件样式基于 shadcn/ui 设计系统

## 部署

构建后的文件在 `dist/` 目录中，可以部署到任何静态文件服务器。

### 生产环境注意事项

1. 确保 API 服务器正确配置 CORS
2. 设置正确的环境变量
3. 启用 HTTPS 以确保安全
4. 配置适当的缓存策略

## 许可证

MIT License