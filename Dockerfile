# 第一阶段：构建前端
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：构建后端
FROM node:18-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend ./

# 第三阶段：最终运行阶段
FROM node:18-alpine
WORKDIR /app

# 安装nginx
RUN apk add --no-cache nginx

# 复制前端构建产物
COPY --from=frontend-builder /app/build /app/frontend

# 复制后端文件
COPY --from=backend-builder /app/backend /app/backend

# 复制nginx配置
COPY nginx.conf /etc/nginx/http.d/default.conf

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 80

# 启动脚本
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"] 