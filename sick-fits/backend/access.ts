// At it's simplest, the access control returns a yes or no value depending on the users session

import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}
