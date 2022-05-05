import './index.module.css';
import Image from 'next/image';
import Link from 'next/link';
import path from 'path';

/* eslint-disable-next-line */
export interface IndexV2Props {}

function Bullet({ children }) {
  return (
    <div>
      <span className="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          className="w-3 h-3"
          viewBox="0 0 24 24"
        >
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      </span>
      {children}
    </div>
  );
}

export function IndexV2(props: IndexV2Props) {
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-6 items-center justify-center flex-col">
          {/*<img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero"*/}
          {/*     src="https://dummyimage.com/720x600" />*/}

          <Image
            className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
            src="https://dvg45c871tdz4.cloudfront.net/images/20200914_075553.jpg"
            width="600"
            height="400"
          />

          <div className="text-center lg:w-2/3 w-full mt-10">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-blue-500">
              Hi, I'm Lane Katris
            </h1>
            <p className="mb-8 leading-relaxed text-left">
              <Bullet>
                I'm a full stack engineer at{' '}
                <a
                  className="text-blue-400"
                  href="https://ironnet.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  IronNet
                </a>
              </Bullet>
              <Bullet>
                I'm a father, rock climber, disc golfer, hiker, kayaker,
                paintballer... anything to get outside
              </Bullet>
              <Bullet>
                <a
                  href="https://climb.rest"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400"
                >
                  climb.rest
                </a>{' '}
                is the latest project I've done that is public
              </Bullet>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default IndexV2;
