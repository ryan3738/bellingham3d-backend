import { KeystoneContext } from '@keystone-next/keystone/types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

interface Arguments {
  token: string;
  shippingId: string;
}

async function checkout(root: any, { token, shippingId }: Arguments, context: KeystoneContext): Promise<any> {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order!');
  }
  // TODO If not signed in then create new user using email and use this userId
  // 1.5 Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    query: graphql`
    id
    name
    email
    cart {
      id
      quantity
      variants {
        id
        name
      }
      product {
        name
        price
        description
        id
        images {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }
    `,
  });
  // console.dir(user, { depth: null });

  // 1.6 Query the shipping address
  const shippingAddress = shippingId
    ? await context.lists.CustomerAddress.findOne({
      where: { id: shippingId },
      resolveFields: graphql`
    id
    firstName
    lastName
    company
    address1
    address2
    city
    region
    country
    zip
    phone
    `,
    })
    : null;

  console.log('Shipping Address!!!', {
    ...shippingAddress,
  });

  // Create object for stripe shipping info
  const getStripeShipping = () => {
    if (!shippingId) return null;
    if (shippingId)
      {return {
        shipping: {
          name: `${shippingAddress.firstName}${` ${shippingAddress.lastName}`}`,
          phone: shippingAddress.phone,
          address: {
            city: shippingAddress.city,
            country: shippingAddress.country,
            line1: shippingAddress.address1,
            line2: shippingAddress.address2,
            postal_code: shippingAddress.zip,
            state: shippingAddress.region,
          },
        },
      };}
  };
  console.log('Stripe Shipping Object', getStripeShipping());
  // console.dir(shippingAddress, { depth: null });

  // 2. Calc the total price for their order
  // Filters out cart items that are no longer products
  const cartItems = user.cart.filter((cartItem: any) => cartItem.product);
  const amount = cartItems.reduce(function (tally: number, cartItem: any) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
  console.log('Order Total', amount);

  // 3. Create the charge with the stripe library
  // Add in shipping option
  // const shippingAddress = {
  //   shipping: {
  //     name: 'Ryan Cool',
  //     phone: '1123456798',
  //     address: {
  //       line1: '123 Test',
  //     },
  //   },
  // };

  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
      ...getStripeShipping(),
      receipt_email: user.email,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  console.log(charge);

  const getImageForConnect = (item) => {
if(item.product.images) {
  return `image: { connect: { id: ${item.product.images[0].id} } }`;
}
  };




  // 4. Convert the cartItems to OrderItems
  const orderItems = cartItems.map((cartItem: any) => {
    // Turn cart item variant names into string for orderItems
    console.log('CARTITEM!!!',cartItem);
    const variants = cartItem?.variants
      .map((variant: any) => variant.name)
      .join(', ');

    console.log('getImageForConnect', getImageForConnect(cartItem));

    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      // image: { connect: { id: cartItem.product.images[0].id } },
      variants,
    };
    console.log('orderItem', orderItem);
    return orderItem;
  });
  console.log('orderItems', orderItems);

  // 5. Create the order and return it

  // 5.1 function to create address connection if present
  function isShipped() {
    if (!shippingId) return null;
    if (shippingId)
      {return {
        shippingAddress: { connect: { id: shippingId } },
      };}
  }

  console.log('Is this item shipped?', {
    ...isShipped(),
  });

  const order = await context.db.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
      ...isShipped(),
    },
  });
  console.log({ order });
  // 6. Clean up any old cart item
  const cartItemIds = user.cart.map((cartItem: any) => cartItem.id);
  console.log('gonna create delete cartItems');
  await context.lists.CartItem.deleteMany({
    where: cartItemIds.map((id: string) => ({ id })),
  });
  return order;
}

export default checkout;
