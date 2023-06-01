
Had some weirdness with Jetbrains Rider and a Chillicream GraphQL client. Was seeing ambiguous reference issues everywhere. Turns out all you have to do is exclude the `Generated` folder! 

[This ticket has the answer](https://youtrack.jetbrains.com/issue/RIDER-66262/Incorrectly-reported-errors-when-using-Strawberry-Shake-library)
