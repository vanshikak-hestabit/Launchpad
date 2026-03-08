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

    const userMessages = conversations.filter(
        (msg) => msg.role === "user"
    )

    const totalMessages = userMessages.length

    const totalConversations = new Set(
    conversations.map((m) => m.conversation_id)
    ).size

    const avgMessages =
    totalConversations > 0
        ? Math.floor(userMessages.length / totalConversations)
        : 0

    const activeCompanions = new Set(
    conversations
        .map((m) => m.conversations?.companion_id)
        .filter(Boolean)
    ).size

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <StatCard
        title="Total Conversations"
        value={totalConversations}
        icon={<MessageCircle className="h-5 w-5 text-primary" />}
        description="All chats created"
      />

      <StatCard
        title="Total Messages"
        value={totalMessages}
        icon={<Clock className="h-5 w-5 text-primary" />}
        description="Messages exchanged"
      />

      <StatCard
        title="Avg Messages"
        value={avgMessages}
        icon={<BarChart3 className="h-5 w-5 text-primary" />}
        description="Per conversation"
      />

        <StatCard
        title="Active Companions"
        value={activeCompanions}
        icon={<Users className="h-5 w-5 text-primary" />}
        description="Used in chats"
        />

    </div>
  )
}