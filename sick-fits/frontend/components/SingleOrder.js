import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import OrderItemStyles from './styles/OrderItemStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      items {
        id
        name
        description
        price
        quantity
        photo {
          id
          image {
            id
            publicUrlTransformed
          }
          altText
        }
      }
    }
  }
`;

export function calcTotalPrice(itemArray) {
  return itemArray.reduce(
    (tally, item) => tally + item.quantity * item.price,
    0
  );
}

// function OrderItem({ orderItem }) {
//   // if (!product) return null;
//   return (
//     <OrderItemStyles>
//       <img
//         width="100"
//         src={orderItem.photo.image.publicUrlTransformed}
//         alt={orderItem.name}
//       />
//       <div>
//         <h3>{orderItem.name}</h3>
//         <p>
//           {formatMoney(orderItem.price * orderItem.quantity)}-
//           <em>
//             {orderItem.quantity} &times; {formatMoney(orderItem.price)} each
//           </em>
//         </p>
//       </div>
//     </OrderItemStyles>
//   );
// }

export default function SingleOrder({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { order } = data;
  return (
    <OrderStyles>
      <Head>
        <title>Sicks Fits | {order.id} </title>
      </Head>
      <h2>Order Summary</h2>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <p>
        <span>Order Items:</span>
        <span>{order.items.length}</span>
      </p>
      <div className="items">
        {order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.title} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Sub Total: {formatMoney(item.price * item.quantity)} </p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <p>{formatMoney(order.total)}</p>
    </OrderStyles>
  );
}
