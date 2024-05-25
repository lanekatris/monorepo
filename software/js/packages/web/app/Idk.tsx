'use client';
// import {
//   Card,
//   Text,
//   Metric,
//   Flex,
//   ProgressBar,
//   Grid,
//   Title,
//   TableHeaderCell,
//   TableRow,
//   TableHead,
//   Table,
//   TableCell,
//   TableBody,
// } from '@tremor/react';
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
import { FeedItem, FeedItemType } from 'packages/web/feed/get-feed';

// export function Idk() {
//   return (
//     // <Card className="max-w-xs mx-auto">
//     //   <Text>Sales</Text>
//     //   <Metric>$ 71,465</Metric>
//     //   <Flex className="mt-4">
//     //     <Text>32% of annual target</Text>
//     //     <Text>$ 225,000</Text>
//     //   </Flex>
//     //   <ProgressBar value={32} className="mt-2" />
//     // </Card>
//     <main className="mx-5">
//       <Title>Dashboard</Title>
//       <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>
//
//       {/* Main section */}
//       <Card className="mt-6">
//         <div className="h-96" />
//       </Card>
//
//       {/* KPI section */}
//       <Grid numItemsMd={2} className="mt-6 gap-6">
//         <Card>
//           {/* Placeholder to set height */}
//           <div className="h-28" />
//         </Card>
//         <Card>
//           {/* Placeholder to set height */}
//           <div className="h-28" />
//         </Card>
//       </Grid>
//     </main>
//   );
// }

// type FeedType =
//   | 'disc-golf-scorecard'
//   | 'climb'
//   | 'disc-golf-disc'
//   | 'obsidian-adventure';

interface FeedTableProps {
  // rows: {
  //   id: string;
  //   type: FeedType;
  //   date: Date;
  //   data: {
  //     climb?: { Route: string; Rating: string };
  //     scorecard?: { coursename: string; '+/-': number };
  //     disc?: {
  //       brand: string;
  //       model: string;
  //       plastic: string;
  //       number: number;
  //       weight?: number;
  //     };
  //     adventure?: { activity: string };
  //   };
  // }[];
  rows: FeedItem[];
}

const feedIcon: { [k in FeedItemType]: React.ReactElement } = {
  'obsidian-adventure': <GiMountains size={20} />,
  'disc-golf-disc': <CgDisc size={20} />,
  'disc-golf-scorecard': <GiDiscGolfBasket size={20} />,
  climb: <GiMountainClimbing size={20} />,

  bookmark: <GiBookmark size={20} />,
  memo: <GiNotebook size={20} />,
  maintenance: <GiWrench size={20} />,
};

const feedTitle: { [k in FeedItemType]: string } = {
  climb: 'Climbed Route',
  'disc-golf-disc': 'New Disc',
  'disc-golf-scorecard': 'DG Round',
  'obsidian-adventure': 'Adventure',

  bookmark: 'Bookmark',
  memo: 'Memo',
  maintenance: 'Maintenance',
};

interface FeedLineItemProps {
  // title: string;
  type: FeedItemType;
  date: Date;
  // children: React.ReactElement | string | undefined;
  children: React.ReactNode;
}

function FeedLineItem({ type, children, date }: FeedLineItemProps) {
  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Box textAlign="center">
        {feedIcon[type]}
        <Typography level="body-xs">{date?.toLocaleDateString()}</Typography>
        <Typography level="body-xs">{feedTitle[type]}</Typography>
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
        {rows.map(({ id, date, data, type }) => (
          <>
            <ListItem key={id}>
              {type === 'obsidian-adventure' && (
                <>
                  {/*<Markdown>{data.adventure?.contents}</Markdown>*/}
                  <FeedLineItem type={type} date={date}>
                    {data.adventure?.activity}
                    <Markdown>{data.adventure?.contents}</Markdown>
                  </FeedLineItem>
                  {/*<b>Adventure</b>: */}
                </>
              )}
              {type === 'disc-golf-disc' && (
                <>
                  <FeedLineItem type={type} date={date}>
                    #{data.disc?.number} - {data.disc?.brand}{' '}
                    {data.disc?.plastic} {data.disc?.model}{' '}
                    {data.disc?.weight && `(${data.disc?.weight}g)`}
                  </FeedLineItem>
                  {/*<Typography level="body-xs">New Disc</Typography>-{' '}*/}
                  {/*<Typography level="body-sm">*/}
                  {/*  #{data.disc?.number} - {data.disc?.brand} {data.disc?.plastic}{' '}*/}
                  {/*  {data.disc?.model}{' '}*/}
                  {/*  {data.disc?.weight && `(${data.disc?.weight}g)`}*/}
                  {/*</Typography>*/}
                </>
              )}
              {type === 'disc-golf-scorecard' && (
                <>
                  {/*<b>Played disc golf</b> @ {data.scorecard?.coursename} (*/}
                  {/*{data.scorecard?.['+/-']})*/}
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
                  {/*<b>Climbed Route</b>: {data.climb?.Route} ({data.climb?.Rating})*/}
                </>
              )}
              {type === 'bookmark' && (
                <>
                  <FeedLineItem type={type} date={date}>
                    <Chip sx={{ mr: '.5em' }}>{data.bookmark?.folder}</Chip>
                    <Link href={data.bookmark?.url} target="_blank">
                      {data.bookmark?.title}
                    </Link>
                    <br />
                    <Typography level="body-xs">
                      {data.bookmark?.excerpt}
                    </Typography>
                  </FeedLineItem>
                </>
              )}
              {type === 'memo' && (
                <>
                  <FeedLineItem type={type} date={date}>
                    <Markdown>{data.memo?.content}</Markdown>
                    {data.memo?.resourceList.map((rl) => (
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
                    {data.maintenance?.Notes}
                    <br />
                    <Chip>{data.maintenance?.Property}</Chip>
                  </FeedLineItem>
                </>
              )}
            </ListItem>
            <ListDivider />
          </>
        ))}
      </List>
    </>
  );
}
