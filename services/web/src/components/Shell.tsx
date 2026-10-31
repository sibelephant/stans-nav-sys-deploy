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
    <div className="min-h-screen flex flex-col bg-[var(--colorNeutralBackground2)]">
      <header className="bg-[var(--colorNeutralBackground1)] border-b border-[var(--colorNeutralStroke2)]">
        <Toolbar className="px-[clamp(16px,4vw,42px)]! min-h-14! py-[9px]!">
          <Link className="flex items-center gap-2.5 text-inherit no-underline" to="/">
            <span className="grid place-items-center w-[30px] h-[30px] rounded-md font-bold text-white bg-[#087e8b]">S</span>
            <span>
              <Subtitle1>STANS</Subtitle1>
              <Caption1 className="ml-1.5 text-[var(--colorNeutralForeground3)]">/ traffic-aware navigation</Caption1>
            </span>
          </Link>
          <span className="flex-1" />
          <Badge
            appearance="tint"
            color="success"
            icon={<span className="w-1.5 h-1.5 rounded-full inline-block bg-current" />}
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
      <nav className="flex items-center justify-between gap-3 overflow-x-auto px-[clamp(16px,4vw,42px)] py-1 bg-[var(--colorNeutralBackground1)] border-b border-[var(--colorNeutralStroke2)]">
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
        <span className="hidden sm:inline-flex gap-[7px] items-center whitespace-nowrap text-[11px] text-[var(--colorNeutralForeground3)]">
          <AppsRegular /> active city graph v2026.10
        </span>
      </nav>
      <main className="w-full max-w-[1240px] mx-auto grid gap-5 sm:gap-7 px-[clamp(16px,4vw,42px)] pt-[18px] sm:pt-[30px] pb-[30px]">{children}</main>
      <footer className="px-[clamp(16px,4vw,42px)] pb-5 text-[var(--colorNeutralForeground3)]">
        <Divider />
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-3">
          <Body1>
            STANS route lab · weights: travel time + live congestion
          </Body1>
          <Caption1 className="inline-flex items-center gap-1.5">
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
    <div className="fixed left-2.5 right-2.5 sm:left-auto sm:right-3 bottom-3 z-5 flex items-center justify-between sm:justify-start gap-1 rounded-md text-[11px] px-1.5 py-1 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke2)] shadow-[var(--shadow-float)]">
      <span className="px-1.5 text-[var(--colorNeutralForeground3)]">Preview state</span>
      <Button
        size="small"
        appearance="subtle"
        icon={<HomeRegular />}
        as="a"
        href="?previewState=data"
      >
        data
      </Button>
      <Button size="small" appearance="subtle" as="a" href="?previewState=loading">
        loading
      </Button>
      <Button size="small" appearance="subtle" as="a" href="?previewState=error">
        error
      </Button>
      <Button size="small" appearance="subtle" as="a" href="?previewState=empty">
        empty
      </Button>
    </div>
  );
}
