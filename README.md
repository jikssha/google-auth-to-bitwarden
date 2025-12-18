# Authenticator Pro

**Authenticator Pro** 是一款专为工程师设计的极简、安全、完全本地化的身份验证器迁移工具。它能将 Google Authenticator 的导出截图或 `otpauth-migration` 数据即刻转换为 Bitwarden 兼容的 JSON 格式。

https://imphub.pepeth.qzz.io/file/1766052876772_chrome_DUxlM2OQ16.png

---

### ✨ 核心特性

* **高成功率识别引擎**：内置 5 重图像处理策略（包括多级二值化、反色处理、中心区域裁剪），即使是光线不均或高密度二维码截图也能精准识别。
* **100% 本地隐私安全**：核心逻辑完全由客户端 JavaScript 驱动，无后端接口，任何密钥或图片数据均不会离开您的浏览器。
* **Vercel / Geist 审美**：遵循极致的克制美学，支持原生系统级的暗色模式切换，提供精密仪器般的交互体验。
* **实时验证预览**：内置 TOTP 算法，支持在迁移前实时查看 6 位动态验证码，确保数据转换的准确性。
* **多选与批量导出**：支持账户搜索、批量勾选，一键生成 Bitwarden 标准导入格式的 JSON 文件。

---

### 🚀 快速开始

1.  **访问应用**：通过浏览器打开 [https://jikssha.github.io/google-auth-to-bitwarden/] 或本地运行 `index.html`。
2.  **获取截图**：在手机 Google Authenticator 应用中选择“导出账户”，对生成的二维码进行截图。
3.  **导入识别**：
    * **拖拽**：直接将图片拖入识别区。
    * **粘贴**：使用 `Ctrl + V` 直接粘贴剪贴板中的截图。
4.  **导出迁移**：在列表中确认账户无误后，点击“导出 JSON”，然后在 Bitwarden 的“导入数据”中使用该文件。

---

### 🔒 安全声明

作为一个开发者工具，我们始终将安全放在首位：
* **无服务器架构**：本项目为纯静态页面，不具备任何上传数据的物理能力。
* **零追踪**：不包含任何第三方分析脚本（如 Google Analytics）或 Cookie。
* **源码透明**：代码逻辑完全公开，欢迎开发者进行安全审计。

---

### 🛠️ 技术实现

* **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
* **解码核心**: [jsQR](https://github.com/cozmo/jsQR), [protobuf.js](https://github.com/protobufjs/protobuf.js)
* **TOTP 逻辑**: [otpauth](https://github.com/hectorm/otpauth)

---
If this tool helped you, please give it a ⭐!

Designed & Built by **[Daemon](https://github.com/jikssha)**
