# Use the official Node.js image as the base image
FROM node:18-alpine

# Install build tools for native dependencies
RUN apk add --no-cache python3 make g++

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Copy the Prisma schema file
COPY prisma/schema.prisma prisma/schema.prisma

# Install dependencies
RUN yarn install

# Copy the rest of the application files into the container
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port the application will run on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]