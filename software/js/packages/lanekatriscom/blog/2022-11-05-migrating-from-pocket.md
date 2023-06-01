
pocket is awesome, it even reads to you. I want  the data for different reasons, like inspiration for an adventure.

directions to export are  [here](https://getpocket.com/export) 

open the html in chrome, then dev tools

```
var a = [];
document.querySelectorAll('li a').forEach(li => {
	a.push({name: li.textContent, url: li.href})
})
```

You can right-click `a` and copy the JSON

Go here to convert to CSV: https://www.convertcsv.com/json-to-csv.htm and download the file

Use DataGrip TODO and import into your table or whatever tool 👍
