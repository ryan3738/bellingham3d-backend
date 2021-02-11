/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

interface Arguments {
  token: string
}

const graphql = String.raw;
async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if(!userId) {
    throw new Error('Sorry! You must be signed in to create and order')
  }
  // 1.5 Query the current user
  const user = await context.lists.User.findOne({
    where: {id: userId},
    resolveFields: graphql`
    id
    name
    email
    cart{
      id
      quantity
      product{
        name
        price
        description
        id
        photo {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }
    `

  });
  console.dir(user, {depth: null})
  // 2. Calculate the total price for their order
  // Filters out cart items not are not longer products
  const cartItems = user.cart.filter(cartItem => cartItem.product);
const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput) {
return tally + cartItem.quantity * cartItem.product.price;
}, 0);
console.log(amount);

  // 3. Create the charge with the stripe library
const charge = await stripeConfig.paymentIntents.create({
  amount,
  currency: 'USD',
  confirm: true,
  payment_method: token,
}).catch(err => {
  console.log(err);
  throw new Error(err.message);
});
console.log(charge)
  // 4. Convert the cartItems to OrderItems
  // 5. Create the order and return it
}

export default checkout;
