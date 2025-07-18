# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY software/blog/package*.json ./
RUN npm install

# Copy rest of the app
#COPY ../../.git .git
COPY .git .git
COPY software/blog .

# Build Astro app
ENV BUILD_MODE=ssr
RUN npm run build

# Expose the port Astro SSR will use (default is 3000)
EXPOSE 4321

# Start the SSR server
#CMD ["npm", "run", "preview"] bump
ENV HOST=0.0.0.0
ENV PORT=4321
CMD ["node", "./dist/server/entry.mjs"]