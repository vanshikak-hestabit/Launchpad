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

export default function AnalyticsGraphs({ calls }) {
  // Calls Per Day 
  const groupedByDate = calls.reduce((acc, call) => {
    const date = new Date(call.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const callsPerDayData = Object.entries(groupedByDate).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  // Duration Buckets 
  const durationBuckets = {
    "0-1m": 0,
    "1-3m": 0,
    "3-5m": 0,
    "5m+": 0,
  };

  calls.forEach((call) => {
    const minutes = call.duration / 60;

    if (minutes <= 1) durationBuckets["0-1m"]++;
    else if (minutes <= 3) durationBuckets["1-3m"]++;
    else if (minutes <= 5) durationBuckets["3-5m"]++;
    else durationBuckets["5m+"]++;
  });

  const durationData = Object.entries(durationBuckets).map(
    ([range, count]) => ({
      range,
      count,
    })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

      {/* Calls Per Day */}
      <div className="bg-card p-4 rounded-xl shadow-sm border h-[260px]">
        <h2 className="text-sm font-semibold mb-2">
          Calls Per Day
        </h2>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={callsPerDayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis
              allowDecimals={false}
              domain={[0, 'auto']}
            />
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

      {/* Duration Distribution */}
      <div className="bg-card p-4 rounded-xl shadow-sm border h-[260px]">
        <h2 className="text-sm font-semibold mb-2">
          Duration Distribution
        </h2>

        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={durationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}