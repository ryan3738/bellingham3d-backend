import { graphQLSchemaExtension } from '@keystone-next/keystone';
import addToCart from './addToCart';
import checkout from './checkout';

// Make a fake graphql tagged template literal
const gql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: gql`
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
