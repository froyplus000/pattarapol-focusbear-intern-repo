FROM node:20-alpine

WORKDIR /app
# install deps first (better caching)
COPY package*.json ./
RUN npm install

# copy the rest (source)
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
