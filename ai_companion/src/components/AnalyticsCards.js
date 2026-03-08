"use client"

import { MessageCircle, Clock, BarChart3, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function StatCard({ title, value, icon, description }) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold">
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

export default function AnalyticsCards({ conversations }) {

  const totalConversations = conversations.length

  const totalDuration = conversations.reduce(
    (sum, c) => sum + (c.duration || 0),
    0
  )

  const avgDuration =
    totalConversations > 0
      ? Math.floor(totalDuration / totalConversations)
      : 0

  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <StatCard
        title="Total Conversations"
        value={totalConversations}
        icon={<MessageCircle className="h-5 w-5 text-primary" />}
        description="All chats created"
      />

      <StatCard
        title="Total Minutes"
        value={totalMinutes}
        icon={<Clock className="h-5 w-5 text-primary" />}
        description="Total chat duration"
      />

      <StatCard
        title="Average Duration"
        value={avgDuration}
        icon={<BarChart3 className="h-5 w-5 text-primary" />}
        description="Per conversation"
      />

      <StatCard
        title="Active Companions"
        value={
          new Set(conversations.map((c) => c.companion_id)).size
        }
        icon={<Users className="h-5 w-5 text-primary" />}
        description="Used in chats"
      />

    </div>
  )
}