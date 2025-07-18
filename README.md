# Discovery

Discovery is a web app for kids about looking for QRs around a place (village, town, area...) to know more information and explore this place at the same time they enjoy looking for the QRs and doing some activities.

It is developed to practise with React, javaScript, CSS, databases and Node.js with Express.

At the web app users might scan the QRs with their phones or tablets to get the medals. Each medal contains some info about the place where the QR is. The web app is developed thinking only in tablets and smartphones.

To develop it I used React, Vite and Firebase for hosting. The database is hosted on [Supabase](https://supabase.com/) and the backend server is working on [Render](https://render.com/). Finally, it uses [Auth0](https://auth0.com/) to manage the users.

The connexion between the data is established through user_medals table, which contains the user id, the medal id and a boolean to know if it is achieved or not. I did it to have only one table with users and one table with the medals, making easier to manage medals info.

It is a personal project developed just to practise and improve my skills.

You can visit the web at the Firebase [link](https://discovery-6f3c1.web.app/).

## Discover Bicorp as an example

In this case, Discovery is developed using my village Bicorp as an example, so all the app is designed thinking on it.

## Next Steps

- Improve the design of the web app, including new icons and images.
- Add loading screens.
- Add more options to users to manage their data.


## About me

You can see more projects in my [GitHub](https://github.com/alvarobcp) profile. I finished my Full-Stack Course and now I am developing some projects by my own. Hope you like it!