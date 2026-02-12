"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentActivity = [
  {
    id: 1,
    user: "Alice Martin",
    initials: "AM",
    action: "Completed project milestone",
    time: "2 minutes ago",
    status: "completed",
  },
  {
    id: 2,
    user: "Bob Wilson",
    initials: "BW",
    action: "Submitted new report for review",
    time: "15 minutes ago",
    status: "pending",
  },
  {
    id: 3,
    user: "Clara Davis",
    initials: "CD",
    action: "Updated billing information",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    user: "David Chen",
    initials: "DC",
    action: "Requested account access upgrade",
    time: "3 hours ago",
    status: "pending",
  },
  {
    id: 5,
    user: "Emma Roberts",
    initials: "ER",
    action: "Published new blog article",
    time: "5 hours ago",
    status: "completed",
  },
]

const statusStyles = {
  completed: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  pending: "bg-amber-50 text-amber-700 hover:bg-amber-50",
}

export default function DashboardActivity() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest actions across your workspace
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border border-border/40 bg-background/50 p-4 transition-colors hover:bg-accent/50"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {item.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {item.user}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`shrink-0 text-xs ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </Badge>
                </div>

                <span className="text-sm text-muted-foreground truncate">
                  {item.action}
                </span>
              </div>

              <span className="shrink-0 text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
