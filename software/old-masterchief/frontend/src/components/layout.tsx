import { Link } from 'react-router-dom';
import { ROUTE_CREATE_BLOG, ROUTE_DISCS, ROUTE_FEED } from '../constants';
import { ReactElement, useState } from 'react';
import CreateEvent from './create-event';

export default function Layout({
  children,
  className = '',
}: {
  children: any;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className={`container ${className}`}>
      <progress id="global-progress" className="fixed non-visible"></progress>
      <header className="no-padding">
        <nav>
          <ul></ul>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            {/*<li>*/}
            {/*  <a href="https://blog.lanekatris.com" target="_blank">*/}
            {/*    Blog*/}
            {/*  </a>*/}
            {/*</li>*/}
            <li>
              <details role="list" dir="rtl">
                <summary aria-haspopup="listbox" role="link">
                  Projects
                </summary>
                <ul role="listbox">
                  <li>
                    <a href="/api/auth/login">Login</a>
                  </li>
                  {/*<li>*/}
                  {/*  <a href="/api/events">Calendar Events</a>*/}
                  {/*</li>*/}
                  <li>
                    <hr />
                  </li>
                  {/*<li>*/}
                  {/*  <a href="/api/climb">Climb Tracker</a>*/}
                  {/*</li>*/}
                  {/*<li>*/}
                  {/*  <hr />*/}
                  {/*</li>*/}
                  <li>
                    <Link to={ROUTE_FEED}>Masterchief</Link>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <Link to={ROUTE_DISCS}>Disc Directory</Link>
                  </li>
                  {/*<li>*/}
                  {/*  <a href="/api/dg/courses">Courses Played</a>*/}
                  {/*</li>*/}
                  {/*<li>*/}
                  {/*  <a href="/api/dg/recommender">Course Recommender</a>*/}
                  {/*</li>*/}
                  {/*<li>*/}
                  {/*  <hr />*/}
                  {/*</li>*/}
                  {/*<li>*/}
                  {/*  <a href="/api/swagger-ui">Swagger Definition</a>*/}
                  {/*</li>*/}
                  {/*<li>*/}
                  {/*  <Link to={ROUTE_CREATE_BLOG}>Create Blog Post</Link>*/}
                  {/*</li>*/}
                </ul>
              </details>
            </li>
            {document.cookie.includes('password=') && (
              <li>
                <a onClick={() => setShow(!show)}>Create Event</a>
              </li>
            )}
          </ul>
          <ul></ul>
        </nav>
        {show && <CreateEvent />}
      </header>
      {children}
    </div>
  );
}
