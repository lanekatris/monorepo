$raw = pulumi stack output --show-secrets -j
$pulumiData = $raw | ConvertFrom-Json

$pulumiSecrets = pulumi config --show-secrets -j | ConvertFrom-Json

$config = @{
    wifi = @{
        ssid     = $pulumiSecrets.'halo:wifiSsid'.value
        password = $pulumiSecrets.'halo:wifiPassword'.value
    }
    aws  = @{
        endpoint     = $pulumiData.endpoint.endpointAddress
        thing_name   = $pulumiData.thingName
        thing_client = $pulumiData.thingName
    }
}

$config | ConvertTo-Json | set-content -path ..\embedded\aquarium\config.json

# Need to create certs now
$pulumiData.privateKey | Set-Content -path ..\embedded\aquarium\private.pem.key
$pulumiData.certificatePem | Set-Content -Path ..\embedded\aquarium\cert.pem.crt