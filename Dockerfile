FROM node:alpine
EXPOSE 80
COPY ./ ./app
WORKDIR app
RUN npm install
RUN npm run build-prod
CMD ["npm", "start"]