import React from 'react';

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*<link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css" />*/}
      <main>{children}</main>
    </>
  );
}
