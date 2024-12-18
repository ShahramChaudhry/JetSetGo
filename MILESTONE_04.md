Milestone 04 - Final Project Documentation
===

NetID
---
sc9425

Name
---
Shahram Chaudhry

Repository Link
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry

URL for deployed site 
---
http://linserv1.cims.nyu.edu:35801/

URL for form 1 (from previous milestone) 
---
http://linserv1.cims.nyu.edu:35801/register.html

Special Instructions for Form 1
---


URL for form 2 (for current milestone)
---
http://linserv1.cims.nyu.edu:35801/login.html

Special Instructions for Form 2
---
username: testuserr123
password: password123

URL for form 3 (from previous milestone) 
---
http://linserv1.cims.nyu.edu:35801/create_itinerary

Special Instructions for Form 3
---
Only accessible after logging in using : username: testuserr123
password: password123

Other ajax interactions involve viewing and deleting itineraries:
http://linserv1.cims.nyu.edu:35801/dashboard

First link to github line number(s) for constructor, HOF, etc.
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/00bb59b0c4fb172da6d666f1413b061f624b7010/public/createitinerary.js 
Line 14 - 19 

Second link to github line number(s) for constructor, HOF, etc.
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/00bb59b0c4fb172da6d666f1413b061f624b7010/public/createitinerary.js
Line 53 - 60

Short description for links above
---
Constructor for destination class


A higher-order function to transform the destinations array into an array of HTML strings.

Link to github line number(s) for schemas (db.js or models folder)
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/tree/master/models

Description of research topics above with points
---
3 points: Unit testing with JavaScript using Jest. 

createitinerary.test.js: This test verifies that when a valid destination is entered, it is added to the destinations array and rendered correctly.

dashboard.test.js: This test checks that itineraries are fetched from the API and correctly rendered in the itineraries-container element, verifying the fetch call and rendered content.

login.test.js: The first test verifies that a valid login triggers shows an alert and redirects to the dashboard. The second test ensures that invalid login credentials trigger the appropriate error message without redirecting.

logout.test.js: This test verifies that logging out redirects the user to the homepage. (screen capture link below)

5 points: Automated functional testing using Sellenium, tests register, login, creating itinerary, viewing it, deleting it and logging out (screen capture link below)

2 points:  Use a CSS framework or UI toolkit. I used tailwind.css I configured a theme and also used tailwind to customize the header and the sidebar.

3 points: Used Visa Requirements API (had to find country codes, make a json file https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/master/public/countrycode.json
 with countries and codes, then use api to fetch visa requirements). 

Links to github line number(s) for research topics described above (one link per line)
---
Unit Testing github and screen capture:

https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/tree/master/__tests__/unit

https://drive.google.com/file/d/10csPXtbFaAQvFW6XgpxWLX6a-cdDkviZ/view?usp=sharing

Sellenium github and screen capture:

https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/master/__tests__/functional/functional.test.mjs

https://drive.google.com/file/d/1KW8qYMtR4D7DQuGIpAtk386a-OjC5ctF/view?usp=sharing

Tailwind:

https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/master/tailwind.config.js

and example for sidebar and header https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/master/public/createitinerary.html


API: 

https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/master/routes/visaRoutes.js Line 21-49


Optional project notes 
--- 
However, pls note that I couldn't find any free APIs. This API is not very reliable,
sometimes give 502 error , so I have tried to complete 10 points in research exlcuding this too. But as can be seen in the automated testing,
it does work mostly. 


Attributions
---
