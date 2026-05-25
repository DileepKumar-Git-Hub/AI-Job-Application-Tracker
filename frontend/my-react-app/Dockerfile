FROM node:18-alpine AS build
WORKDIR /app

# copy package manifests
COPY frontend/my-react-app/package.json frontend/my-react-app/package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm install

# copy source and build
COPY frontend/my-react-app/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
