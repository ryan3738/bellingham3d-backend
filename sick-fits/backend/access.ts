// At it's simplest, the access control returns a yes or no value depending on the users session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria - yes or no. Generated permissions and custom permission
export const permissions = {
  ...generatedPermissions,
  isAwesome({ session }: ListAccessArgs) {
    return session?.data.name.includes('ryan');
  },
};

// Rule based functions - logical functions that can be used for list access (types: products, orders, users, etc)
// Rules can return a boolean -yes or no - or a filter which limits which products they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they owen this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // They can read everything!
    }
    return { status: 'AVAILABLE' };
  },
};
