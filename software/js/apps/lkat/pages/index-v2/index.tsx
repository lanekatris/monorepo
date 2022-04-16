import './index.module.css';
import Image from 'next/image';

/* eslint-disable-next-line */
export interface IndexV2Props {}

export function IndexV2(props: IndexV2Props) {
  return (
    <header className="bg-gray-900 pattern h-screen">
      <div className="container px-6 mx-auto">
        <nav className="flex flex-col py-2 sm:flex-row sm:justify-between sm:items-center">
          <div>
            {/*<a*/}
            {/*  href="#"*/}
            {/*  className="text-2xl font-semibold text-white hover:text-gray-300"*/}
            {/*>*/}
            {/*  Brand*/}
            {/*</a>*/}
          </div>

          <div className="flex items-center mt-2 -mx-2 sm:mt-0">
            <a
              href="#"
              className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-black rounded-md hover:bg-gray-800"
            >
              Notes
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-black rounded-md hover:bg-gray-800"
            >
              Articles
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-black rounded-md hover:bg-gray-800"
            >
              About
            </a>
          </div>
        </nav>

        <div className="flex flex-col items-center py-6 lg:h-[32rem] lg:flex-row">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-semibold text-gray-100">
              Hi, I'm Lane Katris
            </h2>

            <h3 className="text-2xl font-semibold text-gray-100">
              Full stack engineer who enjoys the outdoors 🗻🧗
              {/*<span className="text-blue-400">Guest</span>*/}
            </h3>

            <h3 className="text-2xl font-semibold text-gray-100 mt-3">
              I currently work at{' '}
              <a
                className="text-blue-400"
                href="https://ironnet.com"
                target="_blank"
              >
                IronNet
              </a>
            </h3>

            {/*<p className="mt-3 text-gray-100">*/}
            {/*  Lorem ipsum dolor sit amet, consectetur adipiscing.*/}
            {/*</p>*/}
          </div>

          <div className="flex mt-8 lg:w-1/2 lg:justify-end lg:mt-0">
            <Image
              className="object-cover w-full h-full max-w-2xl rounded-md"
              src="/20200914_075553.jpg"
              width="600"
              height="400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default IndexV2;
