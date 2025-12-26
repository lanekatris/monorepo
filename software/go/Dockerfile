# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.23 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
#COPY . .
RUN go mod download

COPY cmd/ cmd/
COPY pkg/ pkg/
COPY temporalstuff temporalstuff/
COPY fitness/ fitness/
COPY public/ public/
COPY db/ db/
# COPY templates/ templates/
COPY public/ public/
COPY *.go .

RUN CGO_ENABLED=0 GOOS=linux go build -o /lk ./cmd/lk/main.go



# Deploy the application binary into a lean image
# gcr.io/distroless/base-debian11
#FROM ubuntu AS build-release-stage
FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /lk /lk
# COPY --from=build-stage /app/templates /templates
COPY --from=build-stage /app/public /public

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/lk"]
