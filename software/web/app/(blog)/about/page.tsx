import Image from 'next/image';

import aboutImage from './434393123_7438281949593065_9174792310540916431_n.jpg';
import fireTower from './448182925_8332689336765659_3010429954221537544_n.jpg';
import React from 'react';

export default function AboutPage() {
  return (
    <main>
      <h2>About Me</h2>
      <p>
        <Image
          src={aboutImage}
          alt="Lane and his son playing disc golf"
          height={400}
          width={400}
          placeholder="blur"
        />
        <div className={'muted small'}>Lane and his son playing disc golf</div>
      </p>

      <h3>Professional</h3>
      <p>
        I&apos;m a software engineer. I care about delivering a product that
        gives value. Taking requirements and architecting solutions from a full
        stack perspective is my bread and butter. I&apos;m always trying to
        learn and be open minded.
      </p>
      <a href="https://gitconnected.com/lanekatris" target="_blank">
        Live Resume
      </a>
      <br />
      <a href="/resume.pdf">PDF Resume</a>
      <br />
      <br />
      <h3>Fun</h3>
      <p>
        I also enjoy disc golf, ultimate frisbee, rock climbing, paintball,
        basketball, etc. The vast majority of my activities are disc golf
        related.
      </p>

      <h3>West Virginia</h3>
      <p>
        <Image src={fireTower} height={500} alt="Atop a fire tower" />
        <div className={'muted small'}>
          Atop a fire tower in Monongahela National Forest - June 2024
        </div>
      </p>
      <p>
        I live in West Virginia. Although it may be a poor state and folks
        confuse it with &quot;western virginia&quot;... it is a beautiful place.
        Also, not a bad place to raise your children. To be fair though: I dream
        of Colorado a plenty.
      </p>
    </main>
  );
}
