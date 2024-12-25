


JetSetGo

## Overview



Navigating  travel can be overwhelming, especially when juggling visa requirements and planning the perfect itinerary. I have probably spent at least a month worth of time in 2024 just planning trips and that has motivated this web app.  Presenting to you, Jet Set Go, your personalized travel planner that makes exploring the world simpler and smarter!

JetSetGo is a web app that empowers users to create seamless travel plans tailored to their nationality and visa eligibility. Users can register and log in to enter their nationality and current residence permits, and JetSetGo will instantly check which countries they can visit visa-free and which require a visa. Based on this eligibility, users can select travel dates, receive suggested itineraries, and even customize their plans with activities. From ensuring visa compliance to curating memorable itineraries, JetSetGo makes it easy to travel with confidence and style.



## Data Model
The application will store Users, Itineraries and Destinations.

* Users can create multiple Itineraries (via references).
* Each Itinerary can contain multiple Destinations (via embedding), allowing users to plan visits to several countries or cities within a single trip. Each Destination includes specific dates, visa    requirements, and activities for that location.



An Example User:

```javascript
{
  username: "jetsetter",
  hash: // a password hash,
  nationality: "Canadian",
  residence_permits: ["Schengen Visa", "US Green Card"]
  itineraries: // an array of references to List documents
}
```

An Example Itinerary with Embedded Destinations:

```javascript
{
  user: // a reference to a User object
  title: "European Adventure",
  start_date: "2024-05-01",
  end_date: "2024-05-20",
  destinations: [
    {
      country: "France",
      city: "Paris",
      visa_status: "Visa-Free",
      arrival_date: "2024-05-02",
      departure_date: "2024-05-05",
      activities: ["Eiffel Tower Tour", "Louvre Museum Visit"]
    },
    {
      country: "Italy",
      city: "Rome",
      visa_status: "Visa Required",
      arrival_date: "2024-05-06",
      departure_date: "2024-05-10",
      activities: ["Colosseum Tour", "Vatican Museums"]
    }
  ],
  createdAt: // timestamp
}
```


## [Link to Commented First Draft Schema](db.mjs) 

https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/master/db.mjs

## Wireframes

/home - home page
![landing page](wireframes/home.png)

/register registration page
![registration](wireframes/register.png)

/login page 
![login page](wireframes/login.png)

/newitinerary - create new itinerary page
![new itinerary](wireframes/createnew.png)

/itineraries - page that contains user's itineraries
![itineraries](wireframes/itineraries.png)

/itineraries - details
![details](wireframes/itinerarydetails.png)

/settings
![profile settings](wireframes/profile.png)

## Site map

![site map](wireframes/sitemap.jpg)

## User Stories or Use Cases


1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new itinerary
4. as a user, I can view all of the itineraries I have created on a single page
5. as a user, I can add nationalities and visa details
6. as a user, I can delete itineraries

## Research Topics


* (6 points) Use a front-end framework
    * For the travel planner, React will allow us to build a responsive and interactive experience. Users can smoothly navigate between itinerary creation, destination selection, and profile management. React’s virtual DOM also enables fast updates, making the user experience seamless as they add and modify destinations or update travel dates.
      
* (2 points) Use a CSS framework or UI toolkit, use a reasonable of customization of the framework:
    * Tailwind CSS will speed up the styling process for JetSetGo, ensuring a consistent, clean look across all pages, from the dashboard to itinerary details.

* (1-6 points, 1 minimum) Use a server-side JavaScript library or module that we did not cover in class
      * PDFKit is a server-side library that generates PDF files, allowing for custom layouts, text, images, and dynamic data.
      *  In JetSetGo, PDFKit will allow users to download a detailed PDF of their itinerary, including each destination’s visa status, travel dates, and planned activities. This feature is particularly useful for travelers who may want an offline, portable version of their travel plans, which they can print or save for easy reference.
  
* (1 - 6 points, 1 minimum) Per external API used
    * either Gemini API/ Amadeus to enhance the user experience by providing real-time travel information like suggested hotels or flights based on selected destinations, making itinerary planning more comprehensive. 

10 points total out of 10 required points 


## [Link to Initial Main Project File](app.mjs) 

https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-ShahramChaudhry/blob/master/app.mjs

## Annotations / References Used



