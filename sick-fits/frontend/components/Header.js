import Link from 'next/link';
import styled from 'styled-components';
import Nav from './Nav';

const Logo = styled.h1`
  background: red;
`;

export default function Header() {
  return (
    <header>
      <div className="bar">
        <Link href="/">
          <Logo>Sick Fits Logo</Logo>
        </Link>
      </div>
      <div className="sub-bar">
        <p>Search</p>
      </div>
      <Nav />
    </header>
  );
}
