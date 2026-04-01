import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const chartData = [
  { month: "Jan", orders: 186, users: 80 },
  { month: "Feb", orders: 305, users: 200 },
  { month: "Mar", orders: 237, users: 120 },
  { month: "Apr", orders: 73, users: 190 },
  { month: "May", orders: 209, users: 130 },
  { month: "Jun", orders: 214, users: 140 },
];

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#7c3aed", // violet
  },
  users: {
    label: "Users",
    color: "#06b6d4", // cyan
  },
} satisfies ChartConfig;

export function ChartExample() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-bold mb-4">Sales Analytics</h2>

      <ChartContainer config={chartConfig} className="h-75 w-full">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />
          <YAxis />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar dataKey="orders" fill="var(--color-orders)" radius={6} />
          <Bar dataKey="users" fill="var(--color-users)" radius={6} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}