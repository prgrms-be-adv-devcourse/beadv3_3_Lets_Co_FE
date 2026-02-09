FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치 (캐시 효율을 위해 package 파일들만 먼저 복사)
COPY package*.json ./
RUN npm install

# 소스 코드 전체 복사 및 빌드 실행
COPY . .
RUN npm run build
# -> 이 과정이 끝나면 /app/dist 폴더에 빌드 결과물이 생성됩니다.

# -------------------------------------------------------------------
    
FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

# 로컬에서 'npm run build'를 먼저 실행해서 dist 폴더가 있어야 합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# 80번 포트 오픈
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]