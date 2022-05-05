import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import Link from 'next/link';
import Footer from '../components/footer/footer';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Lane's Site</title>
      </Head>
      <div className="min-h-screen ">
        <header className="text-gray-600 body-font">
          <div className="flex max-w-2xl mx-auto px-4">
            <nav className="py-6 flex-1 text-center">
              <Link href="/">
                <a className="mr-5 hover:text-gray-900">Home</a>
              </Link>
              <Link href="/articles">
                <a className="mr-5 hover:text-gray-900">Articles</a>
              </Link>
              <a href="https://mastodon.social/web/@lkat" target="_blank" rel="noreferrer" className="mr-5 hover:text-gray-900">Notes (Mastadon)</a>
              <Link href="/dashboard">
                <a className="mr-5 hover:text-gray-900">Dashboard</a>
              </Link>
            </nav>
          </div>
        </header>
        <main className="container px-6 mx-auto">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}
export default CustomApp;
