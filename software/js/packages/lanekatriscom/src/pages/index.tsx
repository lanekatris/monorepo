import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Hey, I'm {siteConfig.title}</h1>
        <img
          alt="Me on top of Grays Peak, a 14er in Colorado"
          src="https://ik.imagekit.io/lkat//tr:w-0.2/grays-peak-resized-1_Jn1kTLuiK"
        />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title}>
      <HomepageHeader />
      <main>
        <div className={styles.stuff}>
          <p>
            {' '}
            I'm a senior full stack engineer at{' '}
            <a
              href="https://www.ironnet.com/"
              target="_blank"
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >
              IronNet
            </a>{' '}
            who enjoys climbing 🧗, team sports 🏀, disc golf 💿, etc.
          </p>
          <p>
            <ul className={styles.listnone}>
              <li>
                <a
                  href="https://www.linkedin.com/in/lane-katris-80610a44/"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://gitconnected.com/lanekatris" target="_blank">
                  Resume
                </a>
              </li>
              <li>
                <a href="https://github.com/lanekatris" target="_blank">
                  GitHub
                </a>
              </li>
            </ul>
          </p>
        </div>
      </main>
    </Layout>
  );
}
