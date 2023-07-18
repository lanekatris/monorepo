console.log('do the monitor thing enable');

fetch('http://localhost:8080/ping')
  .then((x) => x.json())
  .then((x) => console.log('done', x));
