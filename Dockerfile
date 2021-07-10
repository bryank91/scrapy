FROM public.ecr.aws/lambda/nodejs:12

COPY src/io/serverless/functions.js ./

# You can overwrite command in `serverless.yml` template
CMD ["functions.handler"]
