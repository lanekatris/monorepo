You have to set some secrets in your Pulumi config:
```
pulumi config set wifiSsid YOUR_WIFI_SSID --secret
pulumi config set wifiPassword YOUR_WIFI_PASSWORD --secret
```

Then you need to create a config file for Python to consume. This file tells it how to connect to the wifi, some mqtt information, and it creates certs so we can talk to AWS:

(This will blow away your config/certs! That should be OK though 😉)
```
.\generate-config.ps1
```

Now you need to go over to `embedded\aquarium` and run a script to copy files and then your good to run your MCU!
```
.\copy-files.ps1
ampy --port COM4 run main2.py
```

TODO: Move the above to `main.py` so we actually run on MCU startup!


Don't forget to set postgres variables!

TODO: need flyways cript!


mocha --require ts-node/register --require dotenv/config .\test\aqua-handler.spec.ts
'



I followed this article TODO to work on this