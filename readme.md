

Full Stack Next.JS E-Commerce App

Bellingham 3D is a 3D printing and design service based in Bellingham WA. With the need to showcase products and allow customers to order an array of products, this application dynamically renders item pages and maintains a detailed cart that stores their orders and customizations. This intricate project employs multiple modern web development tools and techniques, including Server Side Rendering, interacting with a GraphQL API, running server-less functions, and dynamically rendering individual item pages with Next JS’s dynamic routes.

Tech used:

Next.js
React
Redux
GraphQL
MongoDB
Apollo Client
Styled-Components
React-Transition-Group
Stripe
Frontend Deployed to Vercel
Keystone-next
Backend Deployed to Digital Ocean

Server Side Rendering with Next.js

Next.js allows for choosing between Server Side Rendering and Static Page Generation on a page-by-page basis. For this application, assuming owners may need to post notice that an item has sold out, I’ve opted for SSR. On the server, the application grabs the data it needs and renders the html that will be sent to the client. This process alone took a considerable amount of fine tuning as the application needs to interact with Apollo’s cache and await results from MongoDB.

Crafting API Resolvers in Keystone-next

The back end is Keystone-next host on Digital Ocean. The server takes in GraphQL schemas and resolvers. The resolvers then fetch the data from MongoDB through interacting with Mongoose schemas.

Integration with Stripe API for Customer Checkout

In the Stripe implementation, testing mode is enabled so no charges are actually incurred, but test data is sent through the application. (Use card number 4242 4242 4242 4242) To ensure a secure checkout, the order is handled on the server. There, prices are recalculated with price information on items from the database to ensure correct charging. The order is then converted to a record in the database. Finally, an order is returned to the client with details on their purchase. Interacting with GraphQL API

To interact with the API, Apollo Client is used within the SSR functions. To allow for flexibility, the client initialization method is written to check for whether it is being used on the server or client. The benefit of only grabbing the relevant data is best seen between the menu page and an individual items page. The menu only needs the name, image, description, and category of an item. The GraphQL query then only requests what it needs. The full item display pages, then, will request further data, such as customizations, options, and price.
