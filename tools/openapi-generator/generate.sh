openapi-generator-cli generate \
    -i http://nestjs:3001/api-json \
    --generator-name typescript-axios \
    -o /local/out \
    --additional-properties=useSingleRequestParameter=true