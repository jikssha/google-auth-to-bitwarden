# Authenticator Pro

将 Google Authenticator 导出的二维码转换为 Bitwarden、1Password、LastPass、KeePass 等格式的纯前端工具。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen.svg)

## ✨ 特性

- 🔒 **纯前端处理** - 所有数据在本地处理，不上传服务器
- 📱 **PWA 支持** - 可安装到桌面/手机，离线可用
- 🎨 **现代化 UI** - 响应式设计，支持深色模式
- 📤 **多格式导出** - 支持 Bitwarden、1Password、LastPass、KeePass、Aegis 等
- 🔍 **智能识别** - 支持批量扫描多张二维码截图
- ⚡ **即时验证** - 实时显示 TOTP 验证码

## 🚀 在线使用

访问部署后的网站即可直接使用，无需安装。

## 📦 本地运行

由于是纯静态站点，直接用任何 HTTP 服务器运行即可：

```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8080
```

然后访问 `http://localhost:8080`

## ☁️ Cloudflare Pages 部署

### 方式一：通过 Dashboard

1. Fork 或克隆此仓库到你的 GitHub 账号
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Workers & Pages** → **Create application** → **Pages**
4. 选择 **Connect to Git**
5. 授权并选择此仓库
6. 配置构建设置：
   - **Project name**: `authenticator-pro`（或自定义）
   - **Production branch**: `main`
   - **Build command**: 留空
   - **Build output directory**: `/`
7. 点击 **Save and Deploy**

### 方式二：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy . --project-name=authenticator-pro
```

## 🔐 安全说明

### 数据隐私

| 项目 | 说明 |
|------|------|
| 数据存储 | 所有数据仅存储在浏览器内存中 |
| 网络传输 | 不向任何服务器发送账户数据 |
| 第三方服务 | 仅加载公共 CDN 的 JavaScript 库 |
| 密钥处理 | TOTP 密钥永远不离开本地浏览器 |

### 安全头配置

项目已配置以下安全头（见 `_headers` 文件）：

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` - 限制资源加载来源
- `Permissions-Policy` - 仅允许必要的浏览器权限

## 📁 项目结构

```
├── index.html      # 主应用（单文件，包含所有功能）
├── sw.js           # Service Worker（离线缓存）
├── manifest.json   # PWA 配置
├── _headers        # Cloudflare Pages 安全头
├── _redirects      # Cloudflare Pages 重定向规则
├── .gitignore      # Git 忽略文件
└── README.md       # 项目说明
```

## 🛠️ 技术栈

- **UI**: Tailwind CSS (CDN)
- **TOTP**: OTPAuth.js
- **二维码解析**: jsQR / html5-qrcode
- **二维码生成**: qrcode.js
- **Protocol Buffer**: protobuf.js
- **Base32**: hi-base32

## 📄 许可证

MIT License

## 🙏 致谢

- [SimpleIcons](https://simpleicons.org/) - 品牌图标
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Vercel](https://vercel.com/) - 设计灵感
