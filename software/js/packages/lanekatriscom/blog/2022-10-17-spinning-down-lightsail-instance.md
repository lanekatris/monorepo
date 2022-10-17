# Spinning Down my Lightsail Instance

## Why?

> I've scratched the itch for K8S, it is now time to be as cloud native as possible. **I'm tired of working on infrastructure** and not banging out my small-ish personal projects

This was a great excercise on finally using Event Sourcing and DevOps with K8S and Argo CD though. I like Event Store DB, but as long as cost doesn't kill me, I think other databases and technologies will help me deploy easier and faster

## What Needs Done?

### Event Store Database
My database of choice was [Event Store](https://www.eventstore.com/). I don't want to lose my data but I need an export of it.

I didn't see a native way to do this so I created a very simple script to dump `$all` events into JSON files. I'll be able to filter and map down the road, I just wanted a usable dump of the data for future processing.

**Here is pretty much the code:**
```typescript
const fs = require('fs');
import axios from 'axios';

async function getNextAndPersist(url: string): Promise<string> {
    const formattedUrl = `${url}?embed=body`;
    console.log(`Querying ${formattedUrl}`);
    const response = await axios.get(formattedUrl, {
        headers: {
            Accept: 'application/vnd.eventstore.atom+json',
        },
    });
    fs.writeFileSync(`data/${encodeURIComponent(url)}.json`,
        JSON.stringify(response.data, null, 2)
    );

	return response.data.links.find((x) => x.relation === 'next')?.uri;
}

(async () => {
	let nextUrl: string | undefined = 'http://100.120.122.119:32417/streams/$all';
	while (nextUrl) {
	    nextUrl = await getNextAndPersist(nextUrl);
    }
	console.log('Done baby');
})();
```

**Some example output:**
```
Querying http://100.120.122.119:32417/streams/%24all/0000000000003EB40000000000003EB4/backward/20?embed=body
Querying http://100.120.122.119:32417/streams/%24all/0000000000002F7F0000000000002F7F/backward/20?embed=body
Querying http://100.120.122.119:32417/streams/%24all/0000000000000E550000000000000E55/backward/20?embed=body
Done baby
```

**A few things to note:**
* My database is available via TailScale TODO so that is where that IP comes from
*  `$all` has a punch of junk in it but thats ok storage is cheap
* The default page size is `20` so things can take a while and you don't know a total of how many events you have so you don't really know how long its going to take because of the cursor based paging. I decided not to change the  page size, I just waited it out
* `?embed=body` is critical to get the actual event data returned back. Otherwise, you just get a URL pointer to the event data

**Export Stats:**
* **23 minutes** to process
* **9,956** files
* **223MB** total file size
* **20Kb - 25Kb** average file sizes
* **26MB** - size of zip with all files

**What's Next?**

I'll probably put those files on S3 or OneDrive. When I'm ready to migrate I'll manually copy locally when I'm mapping the data, no reason for that to live in the cloud and have to worry about CPU and RAM potential costs. Locally I could just put it all into memory if I want 💪

Not sure when I'll be ready to migrate this data. First step was to export it 🤷


### Minio

I only used Minio TODO to as a cache for web scraping my PDGA scraping project. See below TODO for finding where the data is located.

Luckily Minio stores your objects as files on disk, so it can just be zipped up easy peasy 💪

**I ran the following:**
```
sudo zip -r lightsail-minio-backup-2022-10-17.zip /var/snap/microk8s/common/default-storage/default-minio-pv-claim-pvc-8355ec9a-f576-43e9-8f9d-e46320022b68
```

And of course `scp`'d  down for later use

# Where does Micro K8s persist PVC data?

```
sudo du -sh /var/snap/microk8s/common/default-storage/*

2.8G    /var/snap/microk8s/common/default-storage/default-esdb-logs-pv-claim-pvc-26a88ecb-5131-42b9-95fc-e68859a44cf8
46M     /var/snap/microk8s/common/default-storage/default-esdb-pv-claim-pvc-7c317b74-a06d-43b6-914d-d208f3d69129
591M    /var/snap/microk8s/common/default-storage/default-minio-pv-claim-pvc-8355ec9a-f576-43e9-8f9d-e46320022b68
```

