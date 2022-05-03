import './index.module.css';
import Image from 'next/image';

/* eslint-disable-next-line */
export interface IndexV2Props {}

export function IndexV2(props: IndexV2Props) {
  return (
    <>
      <div className="flex flex-col items-center py-6 lg:h-[32rem] lg:flex-row">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-semibold">Hi, I'm Lane Katris</h2>

          <h3 className="text-2xl font-semibold text-gray-500">
            Full stack engineer who enjoys the outdoors 🗻🧗
          </h3>

          <h3 className="text-2xl font-semibold mt-3 text-gray-500">
            I currently work at{' '}
            <a
              className="text-blue-400"
              href="https://ironnet.com"
              target="_blank"
              rel="noreferrer"
            >
              IronNet
            </a>
          </h3>
        </div>

        <div className="flex mt-8 lg:w-1/2 lg:justify-end lg:mt-0 flex-col">
          <Image
            className="object-cover w-full h-full max-w-2xl rounded-md"
            src="https://dvg45c871tdz4.cloudfront.net/images/20200914_075553.jpg"
            width="600"
            height="400"
          />
        </div>
      </div>
      <div className="container px-6 py-8 mx-auto text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-semibold">My GitHub Commits</h1>

          <p className="mt-6 text-gray-500">
            Take this with a grain of salt, I'm moving my private repos to being
            public. I'm bad about committing secrets 🤷‍♂️
          </p>
          <a
            href="https://github.com/lanekatris"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="mt-5"
              src="https://ghchart.rshah.org/lanekatris"
              alt="Lane's GitHub Contribution Chart"
              width="600"
            />
          </a>
        </div>
      </div>

      <div className="container px-6  mx-auto text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-semibold">My Projects</h1>

          <p className="mt-6 text-gray-500">
            A couple projects I have going on. Some require login, disregard
            that
          </p>
          <div className="grid gap-6 mt-8 sm:grid-cols-2">
            <div className="flex items-center  -px-3 ">
              <svg
                className="w-5 h-5 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>

              <a href="https://climb.rest" target="_blank" rel="noreferrer">
                https://climb.rest
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IndexV2;
