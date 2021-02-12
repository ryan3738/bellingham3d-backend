import SingleOrder from '../../components/SingleOrder';

export default function SingleOrderPage({ query }) {
  return <SingleOrder id={query.id} />;
}
