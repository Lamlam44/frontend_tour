FROM node:18-alpine
WORKDIR /app

# Copy package.json trước để tận dụng cache
COPY package*.json ./
RUN npm install

# Copy toàn bộ code frontend
COPY . .

EXPOSE 3000
CMD ["npm", "start"]