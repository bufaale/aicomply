import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, TrendingUp, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  totalContracts: number;
  sentPending: number;
  signRate: number;
  signed: number;
}

export function StatsCards({
  totalContracts,
  sentPending,
  signRate,
  signed,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Contracts",
      value: totalContracts.toLocaleString(),
      description: "All time",
      icon: FileText,
    },
    {
      title: "Sent / Pending",
      value: sentPending.toLocaleString(),
      description: "Awaiting signature",
      icon: Send,
    },
    {
      title: "Sign Rate",
      value: `${signRate}%`,
      description: "Signed vs. total decided",
      icon: TrendingUp,
    },
    {
      title: "Signed",
      value: signed.toLocaleString(),
      description: "Executed contracts",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
