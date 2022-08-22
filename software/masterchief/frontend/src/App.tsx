import './App.css';
import '@picocss/pico/css/pico.min.css';

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
                    <a href="/api/home">Masterchief</a>
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
      <section className="text-center">
        <div>
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
            <p>
              To access the <i>Masterchief</i> link above you have to be
              authenticated. When I get things more formalized I'll expose some
              of the pages I'm working on!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
