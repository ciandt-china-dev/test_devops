# React + Node.js 全栈应用自动化部署

这是一个使用GitHub Actions进行自动化部署的全栈应用示例项目，包含React前端和Node.js后端服务。

## 项目结构

```
.
├── src/               # React前端源代码
├── public/            # 静态资源
├── backend/           # Node.js后端服务
├── .github/           # GitHub Actions配置
├── k8s/               # Kubernetes配置文件
├── Dockerfile         # Docker构建文件
├── nginx.conf         # Nginx配置文件
└── README.md          # 项目文档
```

## 功能特点

### 前端
- React单页应用
- 现代化UI界面
- 自动化构建部署

### 后端
- GitHub Webhook处理
- Repository Dispatch事件触发
- 健康检查接口
- Express.js REST API

## 本地开发

### 前端开发
1. 安装依赖：
```bash
npm install --legacy-peer-deps
```

2. 启动开发服务器：
```bash
npm start
```

3. 构建生产版本：
```bash
npm run build
```

### 后端开发
1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env
```

4. 启动服务：
```bash
npm run dev  # 开发模式
npm start    # 生产模式
```

## Docker部署

项目使用多阶段构建，将前后端服务打包到同一个容器中：

```bash
# 构建镜像
docker build -t my-fullstack-app .

# 运行容器
docker run -d -p 80:80 \
  -e GITHUB_TOKEN=your_github_token \
  my-fullstack-app
```

## 自动化部署流程

本项目使用GitHub Actions实现自动化部署，部署流程如下：

1. 当代码推送到main分支时触发部署流程
2. GitHub Actions执行以下步骤：
   - 检出代码
   - 设置Docker Buildx
   - 登录到容器仓库
   - 构建并推送Docker镜像
   - 配置Kubernetes凭证
   - 应用Kubernetes配置
   - 更新Deployment镜像版本

## 环境变量配置

### GitHub Secrets配置
- `ACR_REGISTRY`: 容器仓库地址
- `ACR_PASSWORD`: 容器仓库密码
- `KUBECONFIG`: Kubernetes配置文件内容
- `GITHUB_TOKEN`: GitHub个人访问令牌

### 应用环境变量
| 变量名 | 描述 | 默认值 |
|--------|------|---------|
| PORT | 后端服务端口 | 3000 |
| GITHUB_TOKEN | GitHub个人访问令牌 | - |
| NODE_ENV | 运行环境 | development |

## Kubernetes部署

应用将被部署到Kubernetes集群中，使用以下资源：

- Deployment: 管理应用的Pod
  - 2个副本
  - 资源限制：CPU 200m，内存 256Mi
  - 资源请求：CPU 100m，内存 128Mi
- Service: 暴露应用服务
  - 类型：ClusterIP
  - 端口：80
- Ingress: 配置外部访问路由
  - 路径：/
  - 重写目标：/

### 手动部署

如果需要手动部署到Kubernetes集群，可以执行以下命令：

```bash
# 替换配置文件中的容器仓库地址
sed -i "s|\${ACR_REGISTRY}|your-registry-url|g" k8s/deployment.yaml

# 应用Kubernetes配置
kubectl apply -f k8s/deployment.yaml
```

## 访问服务

- 前端界面：`http://your-domain/`
- 后端API：`http://your-domain/api/`
- 健康检查：`http://your-domain/health`

## 注意事项

1. 安全性
   - 不要在代码中硬编码敏感信息
   - 确保 `.env` 文件已添加到 `.gitignore`
   - 使用安全的方式管理环境变量和密钥

2. 开发建议
   - 前端开发时使用 `npm start`
   - 后端开发时使用 `npm run dev`
   - 使用 Docker Compose 进行本地集成测试

3. 部署说明
   - 使用多阶段构建优化镜像大小
   - 确保设置正确的环境变量
   - 建议使用容器编排工具进行管理
