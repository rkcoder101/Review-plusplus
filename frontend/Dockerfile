# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . /app/

# Build the Vite project
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Run the Vite development server
CMD ["npm", "run", "dev"]