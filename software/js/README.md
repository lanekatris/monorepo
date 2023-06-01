# Google Location Parsing

How to run

`node_modules\.bin\nx.cmd serve poc`

Open `~/.testies.csv` in excel

Create exclude column with these values:

Burger King


With this formula

`=COUNTIF(Excludes!A$2:A$35,[@name])>0`

Filter Column 1 with the formula to only show false values

Filter name column for NO blank values

Make sure you split windows and put exclude values on a different sheet

I made a backup after I got to 200+ exclusions because my code just blindly overwrites. Maybe I should add a timestamp to the file name... that would help with file locks from excell as well...

I decided to do exclusions in Excel and not in code as I needed an easy UI to do this and doing with code is slow and error prone


