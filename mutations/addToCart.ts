/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

interface Arguments {
  productId: string;
  productVariantIds: string[];
}

async function addToCart(
  root: any,
  { productId, productVariantIds }: Arguments,
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('ADDING TO CART!');
  // 1. Query the current user see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // Process variantIds into array of objects
  const variantIdsObject = productVariantIds.map((id) => ({ id }));
  // console.log('variantIdsObject', variantIdsObject);

  // 2. Query the current users cart looking for matching product and variants combo
  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: sesh.itemId },
      product: { id: productId },
      variants_every: {
        id_in: productVariantIds,
      },
    },
    resolveFields: 'id,quantity,variants',
  });

  // console.log('allCartItems', allCartItems);
  const [existingCartItem] = allCartItems;
  // console.log('existingCartItem', existingCartItem);

  // 3. See if the current item is in their cart
  if (existingCartItem) {
    console.log(existingCartItem);
    console.log(
      `There are already ${existingCartItem.quantity} items, increment by 1!`
    );
    // 4. Increment existingCartItem by 1
    await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,
    });
    return;
  }
  // 4. if item is not in the cart, create a new cart item!

  console.log(
    `Adding product ${productId} with variants ${productVariantIds} to cart`
  );
  // eslint-disable-next-line no-return-await
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
      variants: { connect: variantIdsObject },
    },
    resolveFields: false,
  });
}

export default addToCart;
