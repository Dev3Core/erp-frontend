import { Persona } from "@fluentui/react-components";

export function UserBadge({ name, role }: { name: string; role: string }) {
  return (
    <Persona
      name={name}
      secondaryText={role}
      size="medium"
      textAlignment="center"
      avatar={{ color: "brand", "aria-hidden": true }}
      className="user-persona"
    />
  );
}
