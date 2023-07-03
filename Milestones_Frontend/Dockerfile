FROM nginx:stable-alpine AS runtime
WORKDIR /app
COPY /app/. ./
RUN true
COPY ./config/default.conf /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]