import { Card, Container, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
export function Index() {
  return (
    <Container maxWidth="sm">
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h5" alignContent="center" align="center">
          Hi, I'm Lane Katris
        </Typography>
        <Typography align="center" gutterBottom>
          Full stack engineer who enjoys the outdoors 🌲🗻
        </Typography>
        <Typography variant="h5" alignContent="center" align="center">
          Work
        </Typography>
        <Typography align="center" gutterBottom>
          I currently work at{' '}
          <a href="https://www.ironnet.com/" target="_blank">
            IronNet
          </a>{' '}
          as a full stack developer
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          alignContent="center"
          align="center"
        >
          Social
        </Typography>
        <Typography align="center">
          <a href="https://github.com/lanekatris" target="_blank">
            <GitHubIcon />
          </a>
          <a href="https://gitconnected.com/lanekatris">
            <ArticleIcon />
          </a>
          <a href="https://www.linkedin.com/in/lane-katris-80610a44/">
            <LinkedInIcon />
          </a>
          <a href="mailto:lanekatris@gmail.com">
            <EmailIcon />
          </a>
        </Typography>
      </Card>
    </Container>
  );
}

export default Index;
