FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the gateway code
COPY . .

# Match your requested port
EXPOSE 5000

CMD ["npm", "start"]