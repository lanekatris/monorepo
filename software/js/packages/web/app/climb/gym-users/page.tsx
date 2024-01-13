import request from 'request';
import { parse } from 'node-html-parser';
import axios from 'axios';
import { addDays } from 'date-fns';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Navigation from 'packages/web/layout/navigation';
import {
  Breadcrumbs,
  Container,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from '@mui/joy';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  date: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface Credentials {
  cookies: string[];
}
class AuthenticationService {
  public readonly LOGIN_URL = 'https://my.rhinofit.ca/';

  public async login(input: LoginRequest): Promise<Credentials> {
    const { email, password } = input;

    const formData = {
      email,
      password,
      rememberme: 'on',
    };

    return new Promise((resolve, reject) => {
      request.post({ url: this.LOGIN_URL, formData }, (err, httpResponse) => {
        if (err) {
          return reject(err);
        }
        const cookies = httpResponse.headers['set-cookie'];
        if (!cookies) {
          return reject('Login failed');
        }
        return resolve({ cookies });
      });
    });
  }
}

// @ts-ignore
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

async function getMembers(): Promise<[string]> {
  const authService = new AuthenticationService();
  console.log('Getting credentials...');
  const credentials = await authService.login({
    email: process.env.RHINOFIT_EMAIL!,
    password: process.env.RHINOFIT_PASSWORD!,
  });
  console.log('Getting user list...');
  const today = new Date().toISOString().split('T')[0];
  const lastWeek = addDays(new Date(), -10).toISOString().split('T')[0];
  const result = await axios.get(
    `https://my.rhinofit.ca/datatables.php?method=getaccesstrackingobject&al_event=&start=${lastWeek}&end=${today}`,
    {
      headers: {
        Cookie: credentials.cookies.join('; '),
      },
    }
  );
  return (
    result.data.aaData
      // @ts-ignore
      .filter((x) => x.al_cal_type === 'DAC Entry')
      .reverse()
      // .map((x) => ({
      //   id: x.DT_RowId,
      //   // @ts-ignore
      //   name: parse(x.al_cal_userlink).firstChild.rawText,
      //   date: x.al_cal_datetime.split(' ')[0],
      // }))
      .map(
        // @ts-ignore
        (x) =>
          // @ts-ignore
          `${x.al_cal_datetime.split(' ')[0]} - ${
            // @ts-ignore
            parse(x.al_cal_userlink).firstChild.rawText
          }`
      )
      .filter(onlyUnique)
  );
}

export const revalidate = 3600; // revalidate the data at most every hour
export default withPageAuthRequired(async function GymUsers() {
  const members = await getMembers();
  // const members: Member[] = [];
  return (
    <Container maxWidth={'sm'}>
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Gym Users</Typography>
      </Breadcrumbs>

      <Typography level={'h4'} gutterBottom>
        Recent Gym Users
      </Typography>
      <List>
        <ListItem>
          <ListItemContent>
            <b>Today</b>: {new Date().toISOString().split('T')[0]}
          </ListItemContent>
        </ListItem>
        {members.map((member) => (
          <ListItem key={member}>
            <ListItemContent>{member}</ListItemContent>
          </ListItem>
        ))}
      </List>
    </Container>
  );
});
