FROM public.ecr.aws/lambda/nodejs:12

COPY src/ ./

# You can overwrite command in `serverless.yml` template
CMD ["functions.handler"]
