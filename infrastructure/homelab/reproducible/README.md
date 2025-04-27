```
docker build -t reproducible .
docker run -it -p 2222:22 --name repo reproducible

# other tab
ssh -p 2222 lane@localhost
```