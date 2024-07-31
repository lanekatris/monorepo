'use client';
export default function DiscCharts() {
  return null;
}
// import { Cell, Pie, PieChart, ResponsiveContainer, Text } from 'recharts';
// import { Disc } from 'packages/web/app/discs/page';
// import groupBy from 'lodash.groupby';
// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];
//
// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   index,
//   payload,
// }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);
//
//   // console.log('entry', rest);
//
//   return (
//     <Text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline="central"
//     >
//       {`${payload.name}`}
//     </Text>
//   );
// };
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
// export default function DiscsChart({ discs }: { discs: Disc[] }) {
//   console.log('grouped', groupBy(discs, 'status'));
//   const grouped = groupBy(discs, 'status');
//   const counts = Object.keys(grouped).map((key) => ({
//     name: key,
//     value: grouped[key].length,
//   }));
//   return (
//     // <ResponsiveContainer>
//     <>
//       <h3>hi</h3>
//       <div style={{ width: '100%', height: 300 }}>
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={renderCustomizedLabel}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </>
//     // </ResponsiveContainer>
//   );
// }
