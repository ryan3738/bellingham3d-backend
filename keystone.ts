import { CustomerAddress } from './schemas/CustomerAddress';
import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { InventoryItem } from './schemas/InventoryItem';
import { VariantType } from './schemas/VariantType';
import { Variant } from './schemas/Variant';
import { Category } from './schemas/Category';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { ProductImage } from './schemas/ProductImage';
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { Role } from './schemas/Role';
import 'dotenv/config';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';
import { permissionsList } from './schemas/fields';

function check(name: string) {}

const databaseURL =
  process.env.DATABASE_URL || 'file:./keystone.db';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in inital roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});


export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: process.env.DATABASE_URL
      ? { provider: 'postgresql', url: process.env.POSTGRES_URL }
      : {
        provider: 'sqlite',
        url: databaseURL,
      async onConnect(context) {
        console.log('Connected to the database!');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(context);
        }
      },
    },
    lists: createSchema({
      // Schema items go in here
      User,
      CustomerAddress,
      Category,
      Product,
      ProductImage,
      VariantType,
      Variant,
      InventoryItem,
      CartItem,
      OrderItem,
      Order,
      Role,
    }),
    extendGraphqlSchema,
    ui: {
      // Show the UI only for poeple who pass this test
      isAccessAllowed: ({ session }) =>
        // console.log(session);
        !!session?.data,
    },
    session: statelessSessions(sessionConfig),
    // {
    // Old session config
    //   // GraphQL Query
    //   User: `id name email role { ${permissionsList.join(' ')} }`,
    // }),
  })
);
