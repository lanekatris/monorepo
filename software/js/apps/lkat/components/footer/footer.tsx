import { footerData } from './footer-data';
import { footerSvgMap } from './svg-map';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 sm:flex-row sticky top-[100vh]">
      <Link href="/">
        <a className="text-xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
          Lane's Website
        </a>
      </Link>

      <p className="py-2 text-gray-800 dark:text-white sm:py-0">
        © Copyright {new Date().getUTCFullYear()}. Lane Katris - Lkat
        Industries, LLC
      </p>

      <div className="flex -mx-2">
        {footerData.map(({ href, label, type }) => (
          <a
            href={href}
            className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label={label}
          >
            {footerSvgMap[type]}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
