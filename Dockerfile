FROM node:carbon
EXPOSE 80
WORKDIR ./
RUN npm install
RUN npm run build-prod
CMD ["npm", "start"]