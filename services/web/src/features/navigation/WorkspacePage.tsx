import { useEffect, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Card,
  Caption1,
  CardHeader,
  Title2,
} from "@fluentui/react-components";
import { RouterRegular, ShieldCheckmarkRegular } from "@fluentui/react-icons";
import { api, type ViewState, type WorkspaceData } from "../../api";
import { DataState } from "../../components/States";
import { Hero } from "../../components/Hero";

export function WorkspacePage() {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [state, setState] = useState<ViewState>("loading");

  const loadWorkspace = () => {
    setState("loading");
    api
      .getWorkspace()
      .then((nextData) => {
        setData(nextData);
        setState(nextData.routes.length || nextData.health.length ? "data" : "empty");
      })
      .catch(() => setState("error"));
  };

  useEffect(loadWorkspace, []);
  return (
    <>
      <Hero
        eyebrow="Navigation workspace / route lab"
        title="Explore the active road graph."
        subtitle="Calculate traffic-aware routes, inspect path decisions, and compare algorithm output against a consistent city network snapshot."
        primary="Calculate a named route"
        secondary="Compare algorithms"
        primaryTo="#route-table"
        secondaryTo="#network-health"
      />
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] gap-5" id="route-table">
        <div id="network-health">
          <div className="flex items-baseline justify-between gap-3 mb-2.5">
            <Title2 className="inline-flex items-center gap-2">
              <RouterRegular /> Recent route calculations
            </Title2>
            <Caption1 className="text-[var(--colorNeutralForeground3)]">Traffic weights enabled</Caption1>
          </div>
          <DataState state={state} onRetry={loadWorkspace}>
            <Card className="p-4 overflow-x-auto">
              {data?.routes.map((route) => (
                <CardHeader
                  key={`${route.origin}-${route.destination}`}
                  header={
                    <Title2>
                      {route.origin} to {route.destination}
                    </Title2>
                  }
                  description={`${route.algorithm} · ${route.distance} · ${route.eta}`}
                  action={
                    <Badge
                      color={
                        route.status === "Recommended" ? "success" : "warning"
                      }
                    >
                      {route.status}
                    </Badge>
                  }
                />
              ))}
            </Card>
          </DataState>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-3 mb-2.5">
            <Title2 className="inline-flex items-center gap-2">
              <ShieldCheckmarkRegular /> Network health
            </Title2>
            <Caption1 className="text-[var(--colorNeutralForeground3)]">Current graph snapshot</Caption1>
          </div>
          <div className="grid gap-3">
            {data?.health.map((item) => (
              <Card key={item.title} className="p-3.5">
                <CardHeader
                  header={
                    <Badge
                      color={item.intent === "success" ? "success" : "warning"}
                    >
                      {item.label}
                    </Badge>
                  }
                />
                <Title2 className="my-[7px]">{item.title}</Title2>
                <Body1>{item.body}</Body1>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
