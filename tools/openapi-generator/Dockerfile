FROM timbru31/java-node:jdk-14
RUN npm install @openapitools/openapi-generator-cli@2.5.2 -g --force
RUN mkdir /local
WORKDIR /local
COPY . .
CMD ["sh", "generate.sh"]