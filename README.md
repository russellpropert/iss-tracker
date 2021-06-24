# ISS Tracker

## Description
A marker displays the position of the ISS over a world map. The real time location data is derived from [http://api.open-notify.org](http://api.open-notify.org). The location is updated every 15 seconds, leaving a map line along the way as the marker moves around the world.

## How To Run
The tracker can be run by forking the repository (button in upper left), cloning it to your machine, and dragging the index.html file into your browser window.

## Future Improvements
Right now, this doesn’t work over https, since the data source is http. I think this can be solved using a back end server. If the server retrieves the data, then perhaps the server can securely deliver the data to the browser. 

There is also a problem to be fixed when the ISS crosses the 180th meridian. The line wraps around the world in the wrong direction. I’m going to have to create a special handler which starts a new map line with a negative longitude and ends the old one with an imaginary longitudinal number over 180.

If the computer goes to sleep and wakes up again, the map lines get pretty crazy. I’d like to make the code create distinct lines when there are breaks in reporting times.

