FROM node:18 AS build
WORKDIR /src
COPY . .
RUN npm install && make

# FROM jitsi/web:stable
# WORKDIR /usr/share/jitsi-meet
# COPY --from=build /src/ ./