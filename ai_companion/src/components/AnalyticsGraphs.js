"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsGraphs({ conversations }) {

    const userMessages = conversations.filter(
       (msg) => msg.role === "user"
    )

  // Conversations per day
  const groupedByDate = userMessages.reduce((acc, convo) => {

    const date = new Date(convo.created_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const conversationData = Object.entries(groupedByDate).map(
    ([date, count]) => ({
      date,
      count
    })
  )

  // Conversations per companion
    const groupedByCompanion = userMessages.reduce((acc, convo) => {

        const companion = convo.conversations?.companions?.name || "Unknown"
        acc[companion] = (acc[companion] || 0) + 1
        return acc
    }, {})

  const companionData = Object.entries(groupedByCompanion).map(
    ([companion, count]) => ({
      companion,
      count
    })
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

      {/* Conversations Over Time */}
      <div className="bg-card p-4 rounded-xl border shadow-sm h-[260px]">

        <h2 className="text-sm font-semibold mb-2">
          Conversations Per Day
        </h2>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={conversationData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" tick={{ fontSize: 10 }} />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* Conversations Per Companion */}
      <div className="bg-card p-4 rounded-xl border shadow-sm h-[260px]">

        <h2 className="text-sm font-semibold mb-2">
          Conversations Per Companion
        </h2>

        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={companionData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="companion" tick={{ fontSize: 10 }} />

            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />

            <Tooltip />

            <Bar
              dataKey="count"
              fill="#22c55e"
              radius={[6,6,0,0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  )
}