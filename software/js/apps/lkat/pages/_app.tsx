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
        <title>Lane's Site!</title>
      </Head>
      <div className="pattern bg-gray-900 min-h-screen">
        <header className="">
          <div className="container px-6 mx-auto">
            <nav className="flex flex-col py-2 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <Link href="/">
                  <a className="text-2xl font-bold text-white lg:text-3xl">
                    aka: "LKaT"
                  </a>
                </Link>
              </div>

              <div className="flex items-center mt-2 -mx-2 sm:mt-0">
                <Link href="/notes">
                  <a className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-black rounded-md hover:bg-gray-800">
                    Notes
                  </a>
                </Link>

                <Link href="/articles">
                  <a className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-black rounded-md hover:bg-gray-800">
                    Articles
                  </a>
                </Link>

                <a
                  href="#"
                  className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-black rounded-md hover:bg-gray-800"
                >
                  About
                </a>
              </div>
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
