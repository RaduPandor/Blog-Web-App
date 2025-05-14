FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Install all dependencies (including Vite)
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent

# Copy app source
COPY . .

# Fix permissions
RUN chown -R node /usr/src/app

# Switch to non-root user
USER node

# Start the Vite dev server or preview server
CMD ["npm", "start"]
