# Full Stack Next.JS E-Commerce App

👋 This is an eCommerce backend implementation for Bellingham 3D using KeystoneJS.

## Description
### KeystoneJS

The backend uses KeystoneJS which is a node & Typescript based GraphQL server-side client that uses Next.js for the admin UI. Keystone generates basic GraphQL resolvers generated using Prisma. More advanced resolvers are in the mutations folder. The resolvers then fetch the data from a PostgreSQL database and expose a GraphQL api endpoint. The admin UI can be used as a cms for performing CRUD operations on database items.

### Integration with Stripe API for Customer Checkout

In the Stripe implementation: To ensure a secure checkout, the final checkout mutation is handled on the server. On the server prices are recalculated with product information from the database to ensure correct pricing is charged. The cart is then converted to an order and saved to the database. Finally, an order is returned to the client with details on their purchase.

## Tech used:

- KeystoneJS
- Typescript
- Prisma
- GraphQL
- PostgreSQL
- Supabase
- Digital Ocean
# Running the backend

> **NOTE** you'll need Cloudinary, Stripe, and SMTP credentials set up in your `.env` file or environment variables to run this project. See the `.env.sample` file for required fields.

The frontend client for this project can be seen at [bellingham3d-frontend](https://github.com/ryan3738/bellingham3d-frontend)

## To run the project locally:

1. Clone the repository locally
2. Navigate to the root directory
3. Install dependencies
   
        npm install
        # or
        yarn

4. Run the development server
   
        npm run dev
        # or
        yarn dev

If everything works 🤞 the GraphQL Server and Admin UI will start on [localhost:3000](http://localhost:3000)
## Deploy

This project is hosted on a Digital Ocean droplet and integrates with a PostgreSQL database hosted on Supabase.