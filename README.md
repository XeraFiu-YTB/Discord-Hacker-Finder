# Discord-Hacker-Finder
Find the hackers connected to your account with Discord Data Package


When you get the Data Package from Discord, you have to open the file in the Activity/tns

In the program, you have to replace the file location and the dates when your account was used by the hackers.
```js
//Replace the file location
let data_raw = await getDataFromFile("./sample.json")
//Replace the dates
let data_filtered = await getDataFromDates(data_raw, "2022-03-05", "2022-03-15")
```

Run `node main.js` and a table will be shown on the console.
