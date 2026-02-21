"use client"

import {
  Phone,
  Clock,
  Timer,
  BarChart3,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function StatCard({ title, value, icon, description }) {
  return (
    <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsCards({ calls }) {
  const totalCalls = calls.length

  const totalDuration = calls.reduce(
    (sum, call) => sum + call.duration,
    0
  )

  const avgDuration =
    totalCalls > 0
      ? Math.floor(totalDuration / totalCalls)
      : 0

  const totalMinutes = Math.floor(totalDuration / 60)

  const longestCall =
    totalCalls > 0
      ? Math.max(...calls.map((c) => c.duration))
      : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Calls"
        value={totalCalls}
        icon={<Phone className="h-5 w-5 text-primary" />}
        description="All recorded calls"
      />

      <StatCard
        title="Total Minutes"
        value={totalMinutes}
        icon={<Clock className="h-5 w-5 text-primary" />}
        description="Combined call duration"
      />

      <StatCard
        title="Average Duration (sec)"
        value={avgDuration}
        icon={<Timer className="h-5 w-5 text-primary" />}
        description="Per call average"
      />

      <StatCard
        title="Longest Call (sec)"
        value={longestCall}
        icon={<BarChart3 className="h-5 w-5 text-primary" />}
        description="Maximum duration"
      />
    </div>
  )
}