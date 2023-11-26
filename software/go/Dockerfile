# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.19 AS build-stage

WORKDIR /app

#COPY go.mod go.sum ./
COPY . .
RUN go mod download

#COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /lk ./cmd/lk/main.go



# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /lk /lk

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/lk"]