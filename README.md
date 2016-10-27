## Social-Cop

Social-cop is a fun experiment to incorporate firebase database changes notification subscription in your website.

## Story
There's network of cops know as Socialcops trying to catch thieves. They like keep eachother update about the information of the thieves. So they use Social-cop platform to inform eachother and catch the thieves.

#Installation
1. Clone the repository
2. `cd` into the main folder
3. run `python -m SimpleHTTPServer` and go to `localhost:8000` to start thrashing the thieves.

## Usage
There are two pages :
1. Dashboard (The Home Page)
It displays all the information about the thieves that are out roaming in the street and gives in-browser notifications when some fellow cop detects/identifies new thief. 
You as an agent have an option to track either "All the thieves" or "Selected Thieves" of your concern. You can check them according to your needs of receiving notifications.
2. Admin Panel 
To take any action or update any info about the thieves, Agent needs to go to the Admin Panel by clicking the button at the right. From the panel agent is able to change the location, Vehicle No. of the thief or even Add New Thief's data. All the changes will be pushed to the Database and fellow cops will be notified according to their notification preferences.
