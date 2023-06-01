
I had this issue when user .net webclient trying to talk to another container's api.

It seemed really odd and I didn' tknow why

I forgot how docker networking works. I had two different services with two different docker-compose's so they couldn't access eachother.

Also, I was using localhost:port, which is wrong, I needed to use container name. 

So since I wasn't in a palce to add both services to the same docker network, I added mock server to simulate the other service.


TLDR: Wrong URL in code, remember, you're in docker, so localhost isn't valid. You need FQDN's or docker/container names to route to that are IN YOUR docker network
