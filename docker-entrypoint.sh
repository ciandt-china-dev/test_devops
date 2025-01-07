#!/bin/sh

# 启动nginx
nginx

# 启动后端服务
cd /app/backend && node src/index.js 