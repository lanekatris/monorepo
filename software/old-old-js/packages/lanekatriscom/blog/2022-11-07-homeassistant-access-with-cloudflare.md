
# weirdness
I want to get into RFID and I think the easiset way is via home assistant. Rnning it was weird, you can't use `--host`: `docker run -d --name homeassistant --privileged --restart=unless-stopped -p 8123:8123 -e TZ="America/New_York" -v homeassistant_data:/config  ghcr.io/home-assistant/home-assistant:stable`

Not sure why... all ports should be exposed with the `host` flag...

But the above command works 👍



Also for portainer: docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/user/1000/docker.sock:/var/run/docker.sock --privileged -v portainer_data:/data portainer/portainer-ce:latest


I guess the `sock` is new with later versions of docker?


# yubikey deal 

# general info

I haven't got the google provider going yet
the tunnel works great. I chose to do a tunnel because... well I probably should have used docker but it was easy anyway

I currently have a blank page issue https://github.com/home-assistant/frontend/issues/13728, I tried different docker tags but no luck: https://hub.docker.com/r/homeassistant/home-assistant/tags

I needed to update my hass config to do the reverse proxy from cloudflare.
1. Find where the docker volume is mounted: `docker volume inspect homeassistant_data`
2. (Make a backup first) Edit the hass config file: `vim /home/lane/.local/share/docker/volumes/homeassistant_data/_data/configuration.yaml`
3. I'm not sure what IP to put in this section. I found the IP from the error log in HASS:
```
http:
	use_x_forwarded_for: true
	trusted_proxies:
		- 172.17.0.1
```
4. Restart HASS: `docker restart homeassistant`
5. Take a look at logs to be sure it's happy: `docker logs homeassistant`



Create the tunnel

Create the  application??   https://one.dash.cloudflare.com/3ebca05f3bc1ae6ba8b889f550921295/home
