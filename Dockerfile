# Package
FROM node:18

# Set working directory
WORKDIR /backend

# Install dependecies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["node", "src/index.js"]