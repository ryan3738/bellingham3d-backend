import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';
import { permissionsList } from './schemas/fields';
import { Role } from './schemas/Role';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { CartItem } from './schemas/CartItem';
import { ProductImage } from './schemas/ProductImage';
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { CustomerAddress } from './schemas/CustomerAddress';
import { InventoryItem } from './schemas/InventoryItem';
import { Option } from './schemas/Option';
import { Variant } from './schemas/Variant';
import { Category } from './schemas/Category';
import 'dotenv/config';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';

const databaseURL = process.env.DEV_DATABASE_URL || 'file:./keystone.db';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in?
  secret: process.env.COOKIE_SECRET || 'this secret should only be used in testing',
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
  sessionData: `id name email role { ${permissionsList.join(' ')} }`,
});


export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL!],
        credentials: true,
      },
    },
    db: databaseURL
      ? { provider: 'postgresql', url: databaseURL }
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
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Option,
      Variant,
      InventoryItem,
      CustomerAddress,
      Category,
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
