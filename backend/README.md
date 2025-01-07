# 后端服务

这是一个Node.js后端服务，主要用于处理GitHub webhook的调用。

## 功能特点

- GitHub Repository Dispatch事件触发
- 健康检查接口
- Express.js REST API

## 技术栈

- Node.js
- Express.js
- Axios
- dotenv

## 安装和运行

### 本地开发环境

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
```
编辑 `.env` 文件，设置以下变量：
- `PORT`: 服务端口（默认3000）

3. 启动服务：
```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm start
```

### Docker环境

```bash
# 构建镜像
docker build -t my-fullstack-app .

# 运行容器
docker run -d -p 80:80 my-fullstack-app
```

## API文档

### 触发GitHub Webhook

```
POST /api/trigger-github/:owner/:repo/:token
```

功能：触发GitHub repository dispatch事件

URL参数：
- `owner`: GitHub仓库所有者
- `repo`: GitHub仓库名称
- `token`: GitHub个人访问令牌

示例请求：
```bash
curl -X POST http://localhost:3000/api/trigger-github/ciandt-china-dev/test_devops/ghp_your_token_here
```

响应示例：
```json
// 成功
{
  "message": "GitHub dispatch triggered successfully"
}

// 失败 - 缺少参数
{
  "error": "Missing required parameters: owner, repo, and token"
}

// 失败 - 其他错误
{
  "error": "错误信息"
}
```

### 健康检查

```
GET /health
```

响应示例：
```json
{
  "status": "ok"
}
```

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|---------|
| PORT | 服务端口 | 3000 |
| NODE_ENV | 运行环境 | development |

## 注意事项

1. 安全性
   - 确保通过HTTPS传输token
   - 使用适当的访问控制和认证机制
   - 定期轮换GitHub token

2. 开发建议
   - 使用 `npm run dev` 进行本地开发
   - 代码变更时服务会自动重启
   - 使用 `console.log` 进行调试

3. 部署说明
   - 生产环境使用 `npm start`
   - 确保使用HTTPS保护API调用
   - 建议使用容器编排工具（如Docker Compose或Kubernetes）进行管理 