import { CgDisc } from 'react-icons/cg';
import {
  GiDiscGolfBasket,
  GiMountainClimbing,
  GiMountains,
  GiBookmark,
  GiNotebook,
  GiWrench,
} from 'react-icons/gi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Markdown from 'react-markdown';
import {
  Box,
  Chip,
  Divider,
  Link,
  List,
  ListDivider,
  ListItem,
  Stack,
  Table,
  Typography,
} from '@mui/joy';
import React from 'react';
import { FeedItem, FeedItemType } from '../feed/feed-types';
// import SimpleCalendar from './SimpleCalendar';

interface FeedTableProps {
  rows: FeedItem[];
}

const feedIcon: { [k in FeedItemType]: React.ReactElement } = {
  'obsidian-adventure': <GiMountains size={20} />,
  'disc-golf-disc': <CgDisc size={20} />,
  'disc-golf-scorecard': <GiDiscGolfBasket size={20} />,
  climb: <GiMountainClimbing size={20} />,

  raindrop: <GiBookmark size={20} />,
  memo: <GiNotebook size={20} />,
  maintenance: <GiWrench size={20} />,
};

const feedTitle: { [k in FeedItemType]: string } = {
  climb: 'Climbed Route',
  'disc-golf-disc': 'New Disc',
  'disc-golf-scorecard': 'DG Round',
  'obsidian-adventure': 'Adventure',

  raindrop: 'Bookmark',
  memo: 'Memo',
  maintenance: 'Maintenance',
};

interface FeedLineItemProps {
  type: FeedItemType;
  date: Date;

  children: React.ReactNode;
  link?: string;
}

function FeedLineItem({ type, children, date, link }: FeedLineItemProps) {
  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Box textAlign="center">
        {feedIcon[type]}
        <Typography level="body-xs">{date?.toLocaleDateString()}</Typography>
        <Typography level="body-xs">{feedTitle[type]}</Typography>
        {link && (
          <Typography level="body-xs">
            <a href={link}>Open</a>
          </Typography>
        )}
      </Box>
      {children}
    </Stack>
  );
}

export function FeedTable({ rows }: FeedTableProps) {
  return (
    <>
      {/*<SimpleCalendar />*/}

      <Divider sx={{ mt: '1em' }} />
      <List>
        {rows.map(({ id, date, data, type }) => {
          return (
            <>
              <ListItem key={id}>
                {type === 'obsidian-adventure' && data.adventure && (
                  <>
                    <FeedLineItem
                      type={type}
                      date={date}
                      link={`obsidian://open?vault=vault1&file=${encodeURIComponent(
                        data.adventure.path.replace(
                          `C:\\Users\\looni\\vault1\\`,
                          '',
                        ),
                      )}`}
                    >
                      {data.adventure.activity}

                      <Markdown>{data.adventure.contents}</Markdown>
                    </FeedLineItem>
                  </>
                )}
                {type === 'disc-golf-disc' && (
                  <>
                    <FeedLineItem type={type} date={date}>
                      #{data.disc?.number} - {data.disc?.brand}{' '}
                      {data.disc?.plastic} {data.disc?.model}{' '}
                      {data.disc?.weight && `(${data.disc?.weight}g)`}
                    </FeedLineItem>
                  </>
                )}
                {type === 'disc-golf-scorecard' && (
                  <>
                    <FeedLineItem type={type} date={date}>
                      @ {data.scorecard?.coursename} ({data.scorecard?.['+/-']})
                    </FeedLineItem>
                  </>
                )}
                {type === 'climb' && (
                  <>
                    <FeedLineItem type={type} date={date}>
                      {data.climb?.Route} ({data.climb?.Rating})
                      <blockquote>{data.climb?.Notes}</blockquote>
                    </FeedLineItem>
                  </>
                )}

                {type === 'raindrop' && (
                  <>
                    <FeedLineItem type={type} date={date}>
                      <Link href={data.raindrop?.link} target="_blank">
                        {data.raindrop?.title}
                      </Link>
                      <br />
                      <Typography level="body-xs">
                        {data.raindrop?.excerpt}
                      </Typography>
                    </FeedLineItem>
                  </>
                )}
                {type === 'memo' && (
                  <>
                    <FeedLineItem type={type} date={date}>
                      <Box>
                        <Markdown>{data.memo?.content}</Markdown>
                      </Box>
                      {data.memo?.resources?.map((rl) => (
                        <a
                          href={`https://memo.lkat.io/m/${data.memo?.uid}`}
                          target={'_blank'}
                          key={rl.filename}
                        >
                          <img
                            height={100}
                            // width={100}
                            alt={rl.filename}
                            src={`https://memo.lkat.io/file/${rl.name}/${rl.filename}`}
                          />
                        </a>
                      ))}
                    </FeedLineItem>
                  </>
                )}
                {type === 'maintenance' && (
                  <>
                    <FeedLineItem type={type} date={date}>
                      <Box>
                        {data.maintenance?.title}
                        <Chip>{data.maintenance?.Property}</Chip>
                        <Markdown>{data.maintenance?.Notes}</Markdown>
                      </Box>

                      {/*<br />*/}
                    </FeedLineItem>
                  </>
                )}
              </ListItem>
              <ListDivider />
            </>
          );
        })}
      </List>
    </>
  );
}
