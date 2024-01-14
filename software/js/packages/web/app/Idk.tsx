// 'use client';
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
} from 'react-icons/gi';

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

type FeedType =
  | 'disc-golf-scorecard'
  | 'climb'
  | 'disc-golf-disc'
  | 'obsidian-adventure';

interface FeedTableProps {
  rows: {
    id: string;
    type: FeedType;
    date: Date;
    data: {
      climb?: { Route: string; Rating: string };
      scorecard?: { coursename: string; '+/-': number };
      disc?: {
        brand: string;
        model: string;
        plastic: string;
        number: number;
        weight?: number;
      };
      adventure?: { activity: string };
    };
  }[];
}

const feedIcon: { [k in FeedType]: React.ReactElement } = {
  'obsidian-adventure': <GiMountains size={30} />,
  'disc-golf-disc': <CgDisc size={30} />,
  'disc-golf-scorecard': <GiDiscGolfBasket size={30} />,
  climb: <GiMountainClimbing size={30} />,
};

export function FeedTable({ rows }: FeedTableProps) {
  return null;
  // <Table>
  //   <TableHead>
  //     <TableRow>
  //       <TableHeaderCell>Type</TableHeaderCell>
  //       <TableHeaderCell>Date</TableHeaderCell>
  //       <TableHeaderCell>Event</TableHeaderCell>
  //     </TableRow>
  //   </TableHead>
  //   <TableBody>
  //     {rows.map(({ id, date, data, type }) => (
  //       <TableRow key={id}>
  //         <TableCell>{feedIcon[type]}</TableCell>
  //         {/*hack fix, investigate why undefined*/}
  //         <TableCell>{date?.toLocaleDateString()}</TableCell>
  //         {type === 'obsidian-adventure' && (
  //           <TableCell>Adventure: {data.adventure?.activity}</TableCell>
  //         )}
  //         {type === 'disc-golf-disc' && (
  //           <TableCell>
  //             New Disc: #{data.disc?.number} - {data.disc?.brand}{' '}
  //             {data.disc?.plastic} {data.disc?.model}{' '}
  //             {data.disc?.weight && `(${data.disc?.weight}g)`}
  //           </TableCell>
  //         )}
  //         {type === 'disc-golf-scorecard' && (
  //           <TableCell>
  //             Played disc golf @ {data.scorecard?.coursename} (
  //             {data.scorecard?.['+/-']})
  //           </TableCell>
  //         )}
  //         {type === 'climb' && (
  //           <TableCell>
  //             Climbed Route: {data.climb?.Route} ({data.climb?.Rating})
  //           </TableCell>
  //         )}
  //       </TableRow>
  //     ))}
  //   </TableBody>
  // </Table>
}
