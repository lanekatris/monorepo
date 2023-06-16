import ujson

class AquaConfig:
    def load(self):
        with open("private.pem.key", "r") as f:
            self.private_key = f.read()
        with open("cert.pem.crt", "r") as f:
            self.private_cert = f.read()
        
        with open("config.json", "r") as f:
            settings_string = f.read()
            settings = ujson.loads(settings_string)
            self.wifi_ssid = settings["wifi"]["ssid"]
            self.wifi_password = settings["wifi"]["password"]
            self.aws_endpoint = bytes(settings["aws"]["endpoint"], "utf-8")
            self.thing_name = settings["aws"]["thing_name"]
            self.client_id = settings["aws"]["thing_client"]