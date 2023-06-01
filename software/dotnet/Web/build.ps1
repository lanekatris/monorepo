dotnet lambda package --configuration release --framework net6.0 --output-package dist/idk.zip 
npx serverless@^2.70 deploy
serverless logs -f api -t