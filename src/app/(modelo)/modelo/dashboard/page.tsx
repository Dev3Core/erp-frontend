"use client";

import {
  DollarSign,
  Clock,
  TrendingUp,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const earningsData = [
  { label: "Lun", value: 120 },
  { label: "Mar", value: 200 },
  { label: "Mie", value: 150 },
  { label: "Jue", value: 310 },
  { label: "Vie", value: 280 },
  { label: "Sab", value: 420 },
  { label: "Dom", value: 180 },
];

const maxValue = Math.max(...earningsData.map((d) => d.value));

const topTippers = [
  { name: "user_king_2024", total: "$450", tips: 23 },
  { name: "generous_guy", total: "$320", tips: 15 },
  { name: "nightowl99", total: "$210", tips: 42 },
  { name: "diamond_rain", total: "$180", tips: 8 },
];

export default function ModeloDashboardPage() {
  return (
    <>
      <AppHeader title="Mi Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Ganancias Hoy
              </CardDescription>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$185.00</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="size-3 text-emerald-500" />
                <span className="text-emerald-500">+15%</span> vs ayer
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Esta Semana
              </CardDescription>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,660</div>
              <p className="text-xs text-muted-foreground">de $2,000 meta</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Horas Transmitidas
              </CardDescription>
              <Clock className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28h</div>
              <p className="text-xs text-muted-foreground">este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Top Donantes
              </CardDescription>
              <Heart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">donantes recurrentes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          {/* Weekly earnings chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Ganancias de la Semana</CardTitle>
              <CardDescription>Revenue diario en USD</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2" style={{ height: 200 }}>
                {earningsData.map((day) => (
                  <div
                    key={day.label}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-xs font-medium">${day.value}</span>
                    <div
                      className="w-full rounded-md bg-primary"
                      style={{
                        height: `${(day.value / maxValue) * 160}px`,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top tippers */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Mejores Donantes</CardTitle>
              <CardDescription>Tus top tippers este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTippers.map((tipper, i) => (
                  <div key={tipper.name} className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tipper.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tipper.tips} tips
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{tipper.total}</span>
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
