import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Sanitizer(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [value, setValue] = useState('');

  return (
    <Layout title={siteConfig.title}>
      <main style={{ margin: '0 auto', width: 500 }}>
        <h1>Sanitize Path</h1>
        <input
          style={{ width: '100%' }}
          onChange={(e) => setValue(e.target.value)}
        />
        <h3>Output:</h3>
        <em>{value.replace(/ /g, '-').replace(/·/g, '-')}</em>
      </main>
    </Layout>
  );
}
