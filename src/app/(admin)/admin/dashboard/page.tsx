"use client";

import {
  DollarSign,
  Users,
  Radio,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const kpis = [
  {
    title: "Revenue Total",
    value: "$12,450.00",
    change: "+20.1%",
    trend: "up" as const,
    description: "vs. mes anterior",
    icon: DollarSign,
  },
  {
    title: "Modelos Activas",
    value: "8",
    change: "+2",
    trend: "up" as const,
    description: "este mes",
    icon: Users,
  },
  {
    title: "Salas Online",
    value: "5",
    change: "-1",
    trend: "down" as const,
    description: "en este momento",
    icon: Radio,
  },
  {
    title: "Tokens/Hora",
    value: "342",
    change: "+12.5%",
    trend: "up" as const,
    description: "promedio del mes",
    icon: TrendingUp,
  },
];

const recentActivity = [
  {
    model: "Valentina M.",
    action: "Inicio transmision",
    platform: "Chaturbate",
    time: "Hace 5 min",
  },
  {
    model: "Sofia R.",
    action: "Finalizo turno",
    platform: "Stripchat",
    time: "Hace 23 min",
  },
  {
    model: "Camila D.",
    action: "Nuevos tags asignados",
    platform: "Chaturbate",
    time: "Hace 1h",
  },
  {
    model: "Laura P.",
    action: "Liquidacion aprobada",
    platform: "—",
    time: "Hace 2h",
  },
  {
    model: "Andrea G.",
    action: "Inicio transmision",
    platform: "Stripchat",
    time: "Hace 3h",
  },
];

const topModels = [
  { name: "Valentina M.", revenue: "$3,240", tokens: 16200, pct: 26 },
  { name: "Sofia R.", revenue: "$2,890", tokens: 14450, pct: 23 },
  { name: "Camila D.", revenue: "$2,100", tokens: 10500, pct: 17 },
  { name: "Laura P.", revenue: "$1,820", tokens: 9100, pct: 15 },
  { name: "Andrea G.", revenue: "$1,400", tokens: 7000, pct: 11 },
];

export default function AdminDashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium">
                  {kpi.title}
                </CardDescription>
                <kpi.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="size-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="size-3 text-red-500" />
                  )}
                  <span
                    className={
                      kpi.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {kpi.change}
                  </span>{" "}
                  {kpi.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom section */}
        <div className="grid gap-4 lg:grid-cols-7">
          {/* Top models */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Top Modelos</CardTitle>
              <CardDescription>
                Ranking de revenue este mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topModels.map((model, i) => (
                  <div
                    key={model.name}
                    className="flex items-center gap-4"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {model.name}
                      </p>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${model.pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{model.revenue}</p>
                      <p className="text-xs text-muted-foreground">
                        {model.tokens.toLocaleString()} tkns
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Ultimos eventos del estudio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.action}
                      </p>
                    </div>
                    <div className="text-right">
                      {item.platform !== "—" && (
                        <Badge variant="secondary" className="mb-1 text-[10px]">
                          {item.platform}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
