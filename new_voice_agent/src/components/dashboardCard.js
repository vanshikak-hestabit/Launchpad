"use client"

import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  description,
}) {
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

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`gap-1 font-medium ${
                changeType === "positive"
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                  : "bg-red-50 text-red-600 hover:bg-red-50"
              }`}
            >
              {changeType === "positive" ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {change}
            </Badge>

            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const statsData = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    changeType: "positive",
    icon: <DollarSign className="h-5 w-5 text-primary" />,
    description: "from last month",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+15.3%",
    changeType: "positive",
    icon: <Users className="h-5 w-5 text-primary" />,
    description: "from last month",
  },
  {
    title: "Total Orders",
    value: "1,247",
    change: "-4.5%",
    changeType: "negative",
    icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    description: "from last month",
  },
  {
    title: "Growth Rate",
    value: "12.5%",
    change: "+2.4%",
    changeType: "positive",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    description: "from last quarter",
  },
]

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
