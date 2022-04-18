import './index.module.css';
import Image from 'next/image';

/* eslint-disable-next-line */
export interface IndexV2Props {}

export function IndexV2(props: IndexV2Props) {
  return (
    <>
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

        <div className="flex mt-8 lg:w-1/2 lg:justify-end lg:mt-0 flex-col">
          <Image
            className="object-cover w-full h-full max-w-2xl rounded-md"
            src="/20200914_075553.jpg"
            width="600"
            height="400"
          />
          {/*<div>*/}
          {/*  <img*/}
          {/*    className="mt-5"*/}
          {/*    src="https://ghchart.rshah.org/lanekatris"*/}
          {/*    alt="Lane's GitHub Contribution Chart"*/}
          {/*    width="600"*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
      </div>
    </>
  );
}

export default IndexV2;
