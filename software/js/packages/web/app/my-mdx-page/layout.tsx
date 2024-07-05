import React from 'react';
import { Container } from '@mui/joy';

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="sm">
      {/*<link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css" />*/}
      <main>{children}</main>
    </Container>
  );
}
