FROM node:carbon
EXPOSE 80
COPY ./ ./
RUN npm install
RUN npm run build-prod
CMD ["npm", "start"]