# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (如果存在) 并安装依赖
COPY package.json ./
COPY yarn.lock ./ 
RUN yarn

# 复制项目所有文件到工作目录
COPY . .

# 构建 TypeScript 项目
RUN npm run build

# 暴露应用运行的端口 (根据项目配置，这里使用一个常见端口，实际端口可能需要根据 .env 文件确定)
EXPOSE 3000

# 启动应用
CMD [ "npm", "start" ]