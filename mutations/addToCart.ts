import { KeystoneContext } from '@keystone-next/keystone/types';
import { Session } from '../types';

interface Arguments {
  productId: string;
  productVariantIds: string[];
}

const getIdsForQuery = (ids: string[]) => {
  return ids.map(id => {
    return {
      id: { equals: id },
    };
  });
};

async function addToCart(
  root: any,
  { productId, productVariantIds }: Arguments,
  context: KeystoneContext
): Promise<any> {
  console.log('ADDING TO CART!');
  // 1. Query the current user see if they are signed in

  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }

  console.log('getIdsForQuery()', getIdsForQuery(productVariantIds));

  console.log('productVariantIds', productVariantIds);
  // Process variantIds into array of objects

  const variantIdsCreateObject = productVariantIds.map((id) => ({ id }));

  console.log('variantIdsCreateObject', variantIdsCreateObject);

  // 2. Query the current users cart looking for matching product and variants combo
  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: { equals: sesh.itemId } },
      product: { id: { equals: productId } },
      variants: { every: { OR: getIdsForQuery(productVariantIds) } },
    },
    query: 'id quantity variants { id }',
  });

  console.log('allCartItems', allCartItems);
  const [existingCartItem] = allCartItems;
  console.log('existingCartItem', existingCartItem);

  // 3. See if the current item is in their cart
  if (existingCartItem) {
    console.log(existingCartItem);
    console.log(`There are already ${existingCartItem.quantity}, increment by 1!`);
    // 4. Increment existingCartItem by 1
    return await context.db.lists.CartItem.updateOne({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // 4. if it isnt, create a new cart item!
  console.log(
    `Adding product ${productId} with variants ${productVariantIds} to cart`
  );
  return await context.db.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
      variants: { connect: variantIdsCreateObject },
    },
  });
}

export default addToCart;
