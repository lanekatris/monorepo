# https://www.tomray.dev/nestjs-docker-production#putting-it-all-together
###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci --legacy-peer-deps

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Needed for next.js
#ENV NODE_ENV development
#RUN npm i typescript @types/react
USER node

###################
# Build frontend
###################
FROM node:18-alpine As frontend-build

WORKDIR /usr/src/app

COPY frontend ./

RUN npm ci --legacy-peer-deps

RUN npm run build


###################
# PRODUCTION
###################

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Don't forget the client react stuff
#COPY --chown=node:node --from=build /usr/src/app/src/client ./dist/src/client

COPY --chown=node:node --from=build /usr/src/app/views ./views
COPY --chown=node:node --from=build /usr/src/app/public ./public

# copy frontend over
COPY --chown=node:node --from=frontend-build /usr/src/app/dist ./frontend/dist

# Start the server using the production build
WORKDIR /dist
CMD [ "node", "main.js" ]
