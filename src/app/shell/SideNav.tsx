import {
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,
  bundleIcon,
  CalendarClock20Filled,
  CalendarClock20Regular,
  Money20Filled,
  Money20Regular,
  People20Filled,
  People20Regular,
  Video20Filled,
  Video20Regular,
} from "@fluentui/react-icons";
import type { NavEntry } from "@/shared/module";

// Fluent v9 NavDrawer, rendered inline and static (links, no React state).

const ICONS = {
  dashboard: bundleIcon(Board20Filled, Board20Regular),
  shifts: bundleIcon(CalendarClock20Filled, CalendarClock20Regular),
  rooms: bundleIcon(Video20Filled, Video20Regular),
  liquidations: bundleIcon(Money20Filled, Money20Regular),
  users: bundleIcon(People20Filled, People20Regular),
} as Record<string, ReturnType<typeof bundleIcon>>;

export function SideNav({
  items,
  current,
  label,
}: {
  items: NavEntry[];
  current: string | null;
  label: string;
}) {
  return (
    <nav aria-label={label}>
      <NavDrawer
        open
        type="inline"
        selectedValue={current ?? undefined}
        className="side-nav"
      >
        <NavDrawerHeader />
        <NavDrawerBody>
          <NavSectionHeader>Gestión</NavSectionHeader>
          {items.map((item) => {
            const Icon = ICONS[item.icon] ?? ICONS.dashboard;
            return (
              <NavItem
                key={item.href}
                href={item.href}
                value={item.href}
                icon={<Icon />}
                aria-current={current === item.href ? "page" : undefined}
              >
                {item.label}
              </NavItem>
            );
          })}
        </NavDrawerBody>
      </NavDrawer>
    </nav>
  );
}
