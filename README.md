# crash-processor

## Requirements

- [Docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)

## Usage

- Clone the repository
- In the repository root directory, run `docker-compose up` and wait for everything to start
- The API can be found at `localhost:3000`

## Sending a crash report

To test with a crash report, you can use:

```
curl --location --request POST 'localhost:3000/crash-reports' \
--header 'Content-Type: application/json' \
--data-raw '{
  "projectId": "1234",
  "severity": "error",
  "message": "An error occurred",
  "stacktrace": [
    {
      "file": "Crash.java",
      "method": "crashyMethod",
      "line": 10
    },
    {
      "file": "Main.java",
      "method": "main",
      "line": 5
    }
  ],
  "metadata": {
    "customField": "customValue",
    "customEntity": {
      "id": "123",
      "description": "Sample metadata"
    }
  }
}'
```

## Getting crash reports stats

To get stats about a project, you can run:

```
curl --location --request GET 'localhost:3000/crash-reports/1234'
```

## Scaling

The crash reports consumer can be scaled easily by using `docker-compose up --scale consumer=<number-of-consumer-instances>`.
