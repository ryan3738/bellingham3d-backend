import { KeystoneContext } from '@keystone-6/core/types';
import { Session } from '../types';

interface Arguments {
  productId: string;
  variantIds: string[];
}

// Process variantIds into arrays for query and connect
const getIdsForQuery = (ids: string[]) => {
  return ids.map(id => {
    return {
      id: { equals: id },
    };
  });
};

const getIdsForConnect = (ids: string[]) => ids.map(id =>({ id }));

async function addToCart(
  _root: unknown,
  { productId, variantIds }: Arguments,
  context: KeystoneContext
): Promise<any> {
  console.log('ADDING TO CART!');
  // 1. Query the current user see if they are signed in

  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. Query the current users cart looking for matching product and variants combo
  const allCartItems = await context.query.CartItem.findMany({
    where: {
      user: { id: { equals: sesh.itemId } },
      product: { id: { equals: productId } },
      variants: { every: { OR: getIdsForQuery(variantIds) } },
    },
    query: 'id quantity variants { id }',
  });

  const [existingCartItem] = allCartItems;
  // 3. See if the current item is in their cart
  if (existingCartItem) {
    console.log(`There are already ${existingCartItem.quantity}, increment by 1!`);
    // 4. Increment existingCartItem by 1
    return await context.db.CartItem.updateOne({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // 4. if it isnt, create a new cart item!
  console.log(
    `Adding product ${productId} with variants ${variantIds} to cart`
  );
  return await context.db.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
      variants: { connect: getIdsForConnect(variantIds) },
    },
  });
}

export default addToCart;
