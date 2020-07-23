FROM node:14.4.0
EXPOSE 80
COPY ./ ./app
WORKDIR /app
RUN \
    # Install protocol buffers.
    PROTOC_ZIP=protoc-3.11.4-linux-x86_64.zip &&\
    curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v3.11.4/$PROTOC_ZIP &&\
    unzip -o $PROTOC_ZIP -d /usr/local bin/protoc &&\
    unzip -o $PROTOC_ZIP -d /usr/local 'include/*' &&\
    rm -f $PROTOC_ZIP &&\
    # Install submodules.
    git submodule update --init --recursive &&\
    # Install dependencies and compile bundle.
    npm install &&\
    npm run build-prod-linux
# TODO - Enable npm module pruning
# RUN npm prune --production
CMD ["npm", "start"]