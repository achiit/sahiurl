"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function DeviceChart({ data }: { data: Array<{ device: string; percentage: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="percentage"
          nameKey="device"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

