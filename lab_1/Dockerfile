FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY app.js ./

EXPOSE 4201
ENV PORT=4201
CMD ["node", "app.js"]