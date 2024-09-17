
FROM surnet/alpine-wkhtmltopdf:3.19.0-0.12.6-full as wkhtmltopdf
FROM node:18-alpine

# Install dependencies for wkhtmltopdf
RUN apk add --no-cache \
    libstdc++ \
    libx11 \
    libxrender \
    libxext \
    libssl3 \
    ca-certificates \
    fontconfig \
    freetype \
    ttf-dejavu \
    ttf-droid \
    ttf-freefont \
    ttf-liberation \
    # more fonts
  && apk add --no-cache --virtual .build-deps \
    msttcorefonts-installer \
  # Install microsoft fonts
  && update-ms-fonts \
  && fc-cache -f \
  # Clean up when done
  && rm -rf /tmp/* \
  && apk del .build-deps

# Copy wkhtmltopdf files from docker-wkhtmltopdf image
COPY --from=wkhtmltopdf /bin/wkhtmltopdf /bin/wkhtmltopdf



RUN apk update && apk add bash

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app



WORKDIR /home/node/app

COPY package.json ./


USER node


RUN npm install



COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "api.js" ]                      
