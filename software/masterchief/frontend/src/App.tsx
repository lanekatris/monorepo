import './App.css';
import '@picocss/pico/css/pico.min.css';
import { Link } from 'react-router-dom';
import { ROUTE_FEED } from './constants';

function App() {
  return (
    <div className="container" data-theme="dark">
      <progress id="global-progress" className="fixed non-visible"></progress>
      <header className="no-padding">
        <nav>
          <ul></ul>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="https://blog.lanekatris.com" target="_blank">
                Blog
              </a>
            </li>
            <li>
              <details role="list" dir="rtl">
                <summary aria-haspopup="listbox" role="link">
                  Projects
                </summary>
                <ul role="listbox">
                  <li>
                    <Link to={ROUTE_FEED}>Masterchief</Link>
                  </li>
                  <li>
                    <a href="/api/events">Calendar Events</a>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <a href="/api/climb">Climb Tracker</a>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <a href="/api/dg/discs">Disc Directory</a>
                  </li>
                  <li>
                    <a href="/api/dg/courses">Courses Played</a>
                  </li>
                  <li>
                    <a href="/api/dg/recommender">Course Recommender</a>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <a href="/api/swagger-ui">Swagger Definition</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
          <ul></ul>
        </nav>
      </header>
      <section>
        <div className="text-center">
          <img
            alt="Me on top of Grays Peak, a 14er in Colorado"
            src="https://ik.imagekit.io/lkat//tr:w-0.2/grays-peak-resized-1_Jn1kTLuiK"
          />
          <div>
            <h1>Hey, I'm Lane Katris</h1>
            <p>
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
            <p>I'm also a dad (Link to come...).</p>
          </div>
        </div>
        <p>
          <ul>
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
        <p>
          <h3>Projects</h3>
          {/*<i>The link in the navigation has some projects...</i>*/}
          <ul>
            <li>
              <a href="https://climb.rest" target="_blank">
                climb.rest
              </a>{' '}
              - This is a website that has climbing utilities, it only has one
              though... It shows if a you can climb at a lake by telling you if
              the lake water line is too high
            </li>
            <li>
              <b>Masterchief</b> - This is a Halo codename! (I grew up being a
              big fan, unfortunately the franchise isn't as fun as it used to
              be)
              <br />
              This has a bunch of dynamic content that I'll eventually expose
              publicly. I'll break out the projects within this project in due
              time
            </li>
            <li>
              <b>Climb Tracker</b> - There are a ton of apps for tracking
              climbs... I wanted something to easily keep track of the amount of
              bouldering problems you did and see some stats about those
              sessions.
              <br />
              So I did it myself 🤷 I started out with an Expo + Firebase app
              but the Expo SDK would update and the app would be broken so I
              decided <code>#webistheway</code>
            </li>
            <li>
              <a href="https://github.com/lanekatris/moonboard" target="_blank">
                Moonboard
              </a>{' '}
              - (Not to be confused with the{' '}
              <a href="https://www.moonboard.com/" target="_blank">
                offical Moonboard
              </a>
              ) Is a React + Python + Raspberry Pi web app that controls the
              Neopixels very similarly to the Moonboard app. It doesn't have the
              database of routes and all the extra niceties that the official
              app has though.
              <br /> <br />
              We built a Moonboard! Links to come...
            </li>
          </ul>
        </p>
      </section>
    </div>
  );
}

export default App;
