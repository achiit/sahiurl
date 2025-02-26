"use client"

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", total: 350 },
  { name: "Feb", total: 340 },
  { name: "Mar", total: 330 },
  { name: "Apr", total: 350 },
  { name: "May", total: 320 },
  { name: "Jun", total: 380 },
  { name: "Jul", total: 300 },
  { name: "Aug", total: 320 },
  { name: "Sep", total: 310 },
  { name: "Oct", total: 420 },
  { name: "Nov", total: 320 },
  { name: "Dec", total: 350 },
]

export function BarChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

