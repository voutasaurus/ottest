FROM golang:1.13 AS build
ADD . /app
RUN cd /app && CGO_ENABLED=0 go build -mod=vendor -o app

FROM scratch
COPY --from=build /app/app /
ENTRYPOINT ["/app"]
