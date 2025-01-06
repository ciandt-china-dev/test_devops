# React 应用自动化部署

这是一个使用GitHub Actions进行自动化部署的React应用示例项目。

## 项目结构

```
.
├── src/                # React源代码
├── public/            # 静态资源
├── .github/           # GitHub Actions配置
├── k8s/               # Kubernetes配置文件
├── Dockerfile         # Docker构建文件
└── README.md         # 项目文档
```

## 本地开发

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

需要在GitHub Secrets中配置以下环境变量：

- `ACR_REGISTRY`: 容器仓库地址
- `ACR_PASSWORD`: 容器仓库密码
- `KUBECONFIG`: Kubernetes配置文件内容

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
