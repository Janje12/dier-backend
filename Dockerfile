FROM node:12.16.2
RUN apk add
WORKDIR /Dier-Backend
COPY . .
RUN npm install --production
CMD ["node", "src/app.js"]
