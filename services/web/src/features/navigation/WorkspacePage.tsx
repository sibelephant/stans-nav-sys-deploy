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
  const [state, setState] = useState<ViewState>("data");
  useEffect(() => {
    const load = () =>
      api
        .getWorkspace()
        .then(setData)
        .catch(() => setState("error"));
    load();
    return api.subscribeToChanges((table) => {
      if (["routes", "network_health", "nodes"].includes(table)) load();
    });
  }, []);
  return (
    <>
      <Hero
        eyebrow="Navigation workspace / route lab"
        title="Explore the active road graph."
        subtitle="Calculate traffic-aware routes, inspect path decisions, and compare algorithm output against a consistent city network snapshot."
        primary="Calculate a named route"
        secondary="Compare algorithms"
      />
      <section className="two-column" id="route-table">
        <div>
          <div className="section-title">
            <Title2>
              <RouterRegular /> Recent route calculations
            </Title2>
            <Caption1>Traffic weights enabled</Caption1>
          </div>
          <DataState state={state} onRetry={() => setState("data")}>
            <Card className="table-card">
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
          <div className="section-title">
            <Title2>
              <ShieldCheckmarkRegular /> Network health
            </Title2>
            <Caption1>Current graph snapshot</Caption1>
          </div>
          <div className="stack">
            {data?.health.map((item) => (
              <Card key={item.title}>
                <CardHeader
                  header={
                    <Badge
                      color={item.intent === "success" ? "success" : "warning"}
                    >
                      {item.label}
                    </Badge>
                  }
                />
                <Title2>{item.title}</Title2>
                <Body1>{item.body}</Body1>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Button appearance="primary" icon={<RouterRegular />}>
        Run route calculation
      </Button>
    </>
  );
}
