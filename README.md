# ISS Tracker

## Description
A marker displays the position of the ISS over a world map. The real time location data is derived from [http://api.open-notify.org](http://api.open-notify.org). The location is updated every 10 seconds, leaving a map line along the way as the marker moves around the world.

## How To Run
Fork the repository, clone it to your machine, and drag the index.html file into your browser window.

## Future Improvements
Right now, this doesn’t work over https, since the data source is http. This can be solved using a back end server. If the server retrieves the data, then the server can securely deliver the data to the browser. 

There is also a problem to be fixed when the ISS crosses the 180th meridian. The line wraps around the world in the wrong direction. I’m going to have to create a special handler which starts a new map line with a negative longitude and ends the old one with an imaginary longitudinal number over 180.

If the computer goes to sleep and wakes up again, the map lines get pretty crazy. I’d like to make the code create distinct lines when there are breaks in reporting times.

## MIT License
Copyright (c) 2021 Russell Propert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
