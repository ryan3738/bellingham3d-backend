import { graphQLSchemaExtension } from '@keystone-next/keystone';
import addToCart from './addToCart';
import checkout from './checkout';

// Make a fake graphql tagged template literal
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID, variantIds: [ID]): CartItem
      checkout(token: String!, shippingId: ID): Order
    }
  `,
  resolvers: {
    Mutation: {
      addToCart,
      checkout,
    },
  },
});
