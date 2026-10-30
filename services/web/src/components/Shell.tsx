import type { ReactNode } from "react";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Tab,
  TabList,
  Toolbar,
  ToolbarButton,
  Tooltip,
  Body1,
  Caption1,
  Subtitle1,
} from "@fluentui/react-components";
import {
  AppsRegular,
  ChartMultipleRegular,
  DarkThemeRegular,
  HomeRegular,
  LightbulbFilamentRegular,
  MapRegular,
  WeatherSunnyRegular,
} from "@fluentui/react-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface ShellProps {
  children: ReactNode;
  dark: boolean;
  onToggleTheme: () => void;
}
const navItems = [
  { path: "/", label: "Workspace", icon: <HomeRegular /> },
  { path: "/editor", label: "Graph editor", icon: <MapRegular /> },
  {
    path: "/insights",
    label: "Benchmarks & tutorials",
    icon: <ChartMultipleRegular />,
  },
];

export function Shell({ children, dark, onToggleTheme }: ShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <header className="app-header">
        <Toolbar>
          <Link className="brand" to="/">
            <span className="brand-mark">S</span>
            <span>
              <Subtitle1>STANS</Subtitle1>
              <Caption1>/ traffic-aware navigation</Caption1>
            </span>
          </Link>
          <span className="toolbar-spacer" />
          <Badge
            appearance="tint"
            color="success"
            icon={<span className="status-dot" />}
          >
            Graph online
          </Badge>
          <Tooltip
            content={dark ? "Use light theme" : "Use dark theme"}
            relationship="label"
          >
            <ToolbarButton
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              icon={dark ? <LightbulbFilamentRegular /> : <DarkThemeRegular />}
              onClick={onToggleTheme}
            />
          </Tooltip>
          <Avatar name="Route lab" size={28} />
        </Toolbar>
      </header>
      <nav className="app-nav">
        <TabList selectedValue={location.pathname} appearance="subtle">
          {navItems.map((item) => (
            <Tab
              key={item.path}
              value={item.path}
              icon={item.icon}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Tab>
          ))}
        </TabList>
        <span className="nav-meta">
          <AppsRegular /> active city graph v2026.10
        </span>
      </nav>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <Divider />
        <div>
          <Body1>
            STANS route lab · weights: travel time + live congestion
          </Body1>
          <Caption1>
            <WeatherSunnyRegular /> Autosave on · graph snapshot 2026.10.29
          </Caption1>
        </div>
      </footer>
      {import.meta.env.DEV && <DevStateSwitch />}
    </div>
  );
}

function DevStateSwitch() {
  return (
    <div className="dev-switch">
      <span>Preview state</span>
      <Button
        size="small"
        appearance="subtle"
        icon={<HomeRegular />}
        as="a"
        href="?state=data"
      >
        data
      </Button>
      <Button size="small" appearance="subtle" as="a" href="?state=loading">
        loading
      </Button>
      <Button size="small" appearance="subtle" as="a" href="?state=error">
        error
      </Button>
      <Button size="small" appearance="subtle" as="a" href="?state=empty">
        empty
      </Button>
    </div>
  );
}
