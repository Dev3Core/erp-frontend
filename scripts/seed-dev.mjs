// Datos de prueba para desarrollo local. NO usar contra producción.
//   API_URL=http://localhost:8000 node scripts/seed-dev.mjs
// Crea un estudio con equipo, salas, turnos de los últimos 30 días y
// liquidaciones en los tres estados. Todas las cuentas usan SEED_PASSWORD.

const API =
  (process.env.API_URL ?? "http://localhost:8000").replace(/\/+$/, "") +
  "/api/v1";
const PASSWORD = process.env.SEED_PASSWORD ?? "dev-local-Password1";
const OWNER = process.env.SEED_OWNER ?? "owner@aurora-estudio.co";

let cookie = "";
async function call(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { "content-type": "application/json", cookie },
    body: body ? JSON.stringify(body) : undefined,
  });
  const set = res.headers.getSetCookie();
  if (set.length) cookie = set.map((c) => c.split(";")[0]).join("; ");
  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(
      `${method} ${path} -> ${res.status} ${JSON.stringify(data)}`,
    );
  return data;
}

// 1. Owner + studio (idempotent: skip if it already exists)
try {
  await call("POST", "/auth/register", {
    studio_name: "Estudio Aurora",
    full_name: "Laura Restrepo",
    email: OWNER,
    password: PASSWORD,
  });
} catch (e) {
  if (!String(e).includes("409")) throw e;
  console.log("owner ya existe; se reutiliza");
}
await call("POST", "/auth/login", { email: OWNER, password: PASSWORD });

const existingUsers = (await call("GET", "/users?limit=200")).items;
if (existingUsers.length > 3) {
  console.log("el estudio ya tiene datos; nada que hacer");
  process.exit(0);
}

// 2. Team
const people = [
  ["Carlos Mejía", "monitor1@aurora-estudio.co", "MONITOR"],
  ["Andrés Gómez", "monitor2@aurora-estudio.co", "MONITOR"],
  ["Valentina Ríos", "modelo1@aurora-estudio.co", "MODEL"],
  ["Sofía Herrera", "modelo2@aurora-estudio.co", "MODEL"],
  ["Camila Ortiz", "modelo3@aurora-estudio.co", "MODEL"],
  ["Mariana López", "modelo4@aurora-estudio.co", "MODEL"],
];
const users = {};
for (const [full_name, email, role] of people) {
  const u = await call("POST", "/users", {
    full_name,
    email,
    password: PASSWORD,
    role,
  });
  users[email] = u.id;
}
const monitors = [
  users["monitor1@aurora-estudio.co"],
  users["monitor2@aurora-estudio.co"],
];
const models = people.filter((p) => p[2] === "MODEL").map((p) => users[p[1]]);

// 3. Rooms
const rooms = [];
for (const [i, platform] of [
  "CHATURBATE",
  "STRIPCHAT",
  "CHATURBATE",
  "STRIPCHAT",
].entries()) {
  const r = await call("POST", "/rooms", {
    name: `Sala ${["Norte", "Sur", "Centro", "Jardín"][i]}`,
    platform,
    url: `https://${platform.toLowerCase()}.com/aurora_room_${i + 1}`,
  });
  rooms.push(r.id);
}
await call("PATCH", `/rooms/${rooms[0]}`, { status: "ONLINE" });
await call("PATCH", `/rooms/${rooms[3]}`, { status: "INCIDENT" });

// 4. Split + TRM
await call("POST", "/split-configs", {
  label: "Estándar",
  platform_pct: "0",
  studio_pct: "40",
  model_pct: "60",
  is_default: true,
});
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Bogota",
}).format(new Date());
await call("POST", "/exchange-rates", {
  rate_date: today,
  cop_per_usd: "3925.50",
  source: "manual",
});

// 5. Shifts over the last 30 days (deterministic pseudo-random)
let seed = 7;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const finished = [];
for (let d = 29; d >= 0; d--) {
  const perDay = 1 + Math.floor(rand() * 3);
  for (let k = 0; k < perDay; k++) {
    const start = new Date(Date.now() - d * 86_400_000);
    start.setUTCHours(13 + k * 5, 0, 0, 0);
    const end = new Date(start.getTime() + 5 * 3_600_000);
    const s = await call("POST", "/shifts", {
      model_id: models[Math.floor(rand() * models.length)],
      room_id: rooms[Math.floor(rand() * 3)],
      monitor_id: monitors[Math.floor(rand() * 2)],
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    });
    if (d === 0 && k === perDay - 1) {
      await call("PATCH", `/shifts/${s.id}`, { status: "ACTIVE" });
      continue;
    }
    const tokens = 800 + Math.floor(rand() * 4200);
    await call("PATCH", `/shifts/${s.id}`, {
      status: "FINISHED",
      tokens_earned: tokens,
      usd_earned: (tokens * 0.05).toFixed(2),
    });
    finished.push(s.id);
  }
}
// A couple of upcoming shifts
for (let k = 1; k <= 2; k++) {
  const start = new Date(Date.now() + k * 86_400_000);
  start.setUTCHours(14, 0, 0, 0);
  await call("POST", "/shifts", {
    model_id: models[k],
    room_id: rooms[k],
    monitor_id: monitors[k % 2],
    start_time: start.toISOString(),
  });
}

// 6. Liquidations for the latest finished shifts, in all three states
const latest = finished.slice(-9);
for (const [i, shift_id] of latest.entries()) {
  const l = await call("POST", "/liquidations/from-shift", { shift_id });
  if (i < 3) {
    await call("PATCH", `/liquidations/${l.id}`, { status: "APPROVED" });
    await call("PATCH", `/liquidations/${l.id}`, { status: "PAID" });
  } else if (i < 6) {
    await call("PATCH", `/liquidations/${l.id}`, { status: "APPROVED" });
  }
}

console.log(
  `listo: ${people.length + 1} usuarios, ${rooms.length} salas, ${finished.length} turnos finalizados, ${latest.length} liquidaciones`,
);
console.log(
  `accede con ${OWNER} (contraseña: SEED_PASSWORD o la de este script)`,
);
