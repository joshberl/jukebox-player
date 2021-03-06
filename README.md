README for COMP20 semester group project for group 7: Josh Berl, David McConnell, Julie Sanduski, Rex Umezuruike

Project title – JukeBox (jukebox-player.herokuapp.com)

Problem statement – Different types of crowds like different types of music. One DJ cannot typically appeal to all types of crowds. A DJ can never just guess what most people at that specific party would be interested in listening to. 

Solve the problem – This DJ App will finally create a link from our DJ to our crowd of people by allowing people to add songs to the queue to be played. 

Implementation – We will use a (1) Spotify API for playing the songs and a (2) a GoogleMaps API to display who has been using Jukebox around you in the past week.

Pick 5: (1) Geolocation.
(2) Front-end framework (Boostrap).
(3) Data or screen scraping.
(4) Server-side data persistence (MongoDB).
(5) Client-side data persistence (localStorage).

Will be collecting songs that will be put onto a queue, on page refresh the next song in the queue will be displayed.

Notes on implementation ideas:
(1) Geolocation used to see where the app has been used in the past week.
(2) Bootstrap used for buttons, forms, and as a placeholder for text.
(3) Data scraping used to get code from the URL.
(4) MongoDB/Server-side persistence - Saves the queue of songs.
(5) LocalStorage saves the code on the homepage after it is generated.

Future ideas to implement:
In the future we look to introduce an upvoting/downvoting button to strongly prioritize what songs are preferred over others. We could also display a subsection of the top 3 songs in the queue that could be titled "Songs to be played next: ". We could even link a database of lyrics to each song so the people using the app could sing along. 




