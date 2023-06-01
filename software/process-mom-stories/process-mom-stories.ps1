# Make these values arguments and use below, allow overridability

$date = get-date -format "yyyyMMdd-HHmmss"
$tikaJar = "tika-app-2.6.0.jar"
# $tikaExists = Test-Path $tikaJar
if (-not(Test-Path $tikaJar)) {
    Invoke-WebRequest "https://dlcdn.apache.org/tika/2.6.0/$tikaJar" -OutFile $tikaJar
}

java -jar $tikaJar --text -i C:\Users\looni\OneDrive\Documents\Mom\Documents\Stories -o ./parsed-stories -numConsumers 100

get-content ./parsed-stories/*.txt | set-content "$date-all-stories.txt"

# Upload to aws bucket

# Create a comprehend job or do it manually