"use client";

import {
  Users,
  Radio,
  MessageSquare,
  Clock,
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
import { Badge } from "@/components/ui/badge";

const assignedModels = [
  { name: "Valentina M.", platform: "Chaturbate", status: "online", tokens: 320 },
  { name: "Sofia R.", platform: "Stripchat", status: "online", tokens: 185 },
  { name: "Camila D.", platform: "Chaturbate", status: "offline", tokens: 0 },
];

export default function MonitorDashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard Monitor" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Modelos Asignadas
              </CardDescription>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">para este turno</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Online Ahora
              </CardDescription>
              <Radio className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">transmitiendo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Mensajes Hoy
              </CardDescription>
              <MessageSquare className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="size-3 text-emerald-500" />
                <span className="text-emerald-500">+12</span> vs ayer
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                Horas del Turno
              </CardDescription>
              <Clock className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5h</div>
              <p className="text-xs text-muted-foreground">de 8h programadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Modelos Asignadas</CardTitle>
            <CardDescription>Estado en tiempo real de tus modelos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedModels.map((model) => (
                <div
                  key={model.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-2.5 rounded-full ${model.status === "online" ? "bg-emerald-500" : "bg-zinc-300"}`}
                    />
                    <div>
                      <p className="text-sm font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {model.platform}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {model.status === "online" && (
                      <span className="text-sm font-medium">
                        {model.tokens} tkns/h
                      </span>
                    )}
                    <Badge
                      variant={
                        model.status === "online" ? "default" : "secondary"
                      }
                    >
                      {model.status === "online" ? "En vivo" : "Offline"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
