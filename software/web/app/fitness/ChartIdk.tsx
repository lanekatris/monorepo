'use client';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
// const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];
export default function FitnessChart({
  chartData,
}: {
  chartData: { date: string; blah: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        // width={600}
        // height={300}
        data={chartData}
        // margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        margin={{ left: -20, top: 10 }}
      >
        <Line type="monotone" dataKey="blah" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        {/*<Legend />*/}
      </LineChart>
    </ResponsiveContainer>
  );
}
