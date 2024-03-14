FROM node:16-alpine AS base 


FROM base AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install 

FROM base as builder 
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install -g serve 
ENTRYPOINT [ "serve", "-s", "build", "-p", "9005"]
# CMD [ "ls" ]
