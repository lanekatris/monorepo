'use client';

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
import React, { useState } from 'react';
import { FeedItem, FeedItemType } from '../feed/feed-types';

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
      <Typography level="body-sm">{children}</Typography>
    </Stack>
  );
}

export function FeedTable({ rows }: FeedTableProps) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  return (
    <>
      <Box textAlign="center">
        <DatePicker
          // inputStyle={{ textAlign: 'center' }}
          selected={startDate}
          onChange={() => {}}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      </Box>

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
                          ''
                        )
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
                      {/*<Chip sx={{ mr: '.5em' }}>{data.raindrop?.folder}</Chip>*/}
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
                      <Markdown>{data.memo?.content}</Markdown>
                      {data.memo?.resourceList?.map((rl) => (
                        <img
                          height={100}
                          // width={100}
                          key={rl.name}
                          src={`https://memo.lkat.io/o/r/${rl.name}`}
                        />
                      ))}
                    </FeedLineItem>
                  </>
                )}
                {type === 'maintenance' && (
                  <>
                    <FeedLineItem type={type} date={date}>
                      {data.maintenance?.title}
                      <Markdown>{data.maintenance?.Notes}</Markdown>
                      <br />
                      <Chip>{data.maintenance?.Property}</Chip>
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
