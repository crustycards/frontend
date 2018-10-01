FROM node:alpine
EXPOSE 80
COPY ./ ./app
WORKDIR /app
RUN npm install
RUN npm run build-prod
RUN npm prune --production
CMD ["npm", "start"]