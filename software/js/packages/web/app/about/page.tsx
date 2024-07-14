import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/joy';
import Image from 'next/image';

import aboutImage from './434393123_7438281949593065_9174792310540916431_n.jpg';
import fireTower from './448182925_8332689336765659_3010429954221537544_n.jpg';
import React from 'react';

export default function AboutPage() {
  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography fontWeight="bold">About Me</Typography>
      </Breadcrumbs>

      <Box>
        <Image
          src={aboutImage}
          alt="Lane and his son playing disc golf"
          // sizes="100vw"
          // style={{
          //   width: '100%',
          //   height: 'auto',
          // }}
          // style={{ textAlign: 'center' }}
          height={400}
          width={400}
          placeholder="blur"
        />
        <Typography level="body-xs">
          Lane and his son playing disc golf
        </Typography>
      </Box>

      <br />
      <Typography level="h3">Professional</Typography>
      <Typography>
        I'm a software engineer. I care about delivering a product that gives
        value. Taking requirements and architecting solutions from a full stack
        perspective is my bread and butter. I'm always trying to learn and be
        open minded.
      </Typography>
      <br />
      <a href="https://gitconnected.com/lanekatris" target="_blank">
        Live Resume
      </a>
      <br />
      <a href="/resume.pdf">PDF Resume</a>
      <br />
      <br />
      <Typography level="h3">Fun</Typography>
      <Typography>
        I also enjoy disc golf, ultimate frisbee, rock climbing, paintball,
        basketball, etc. The vast majority of my activities are disc golf
        related.
      </Typography>
      <br />

      <Typography level="h3" gutterBottom>
        West Virginia
      </Typography>
      <Box>
        <Image src={fireTower} height={500} alt="Atop a fire tower" />
        <Typography level="body-xs">
          Atop a fire tower in Monongahela National Forest - June 2024
        </Typography>
      </Box>
      <Typography>
        I live in West Virginia. Although it may be a poor state and folks
        confuse it with "western virginia"... it is a beautiful place. Also, not
        a bad place to raise your children. To be fair though: I dream of
        Colorado a plenty.
      </Typography>
    </Container>
  );
}
