import { useEffect, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Card,
  CardHeader,
  Caption1,
  Title2,
} from "@fluentui/react-components";
import { ChartMultipleRegular, ClockRegular } from "@fluentui/react-icons";
import { api, type InsightsData, type ViewState } from "../../api";
import { DataState } from "../../components/States";
import { Hero } from "../../components/Hero";

export function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [state, setState] = useState<ViewState>("data");
  useEffect(() => {
    api
      .getInsights()
      .then(setData)
      .catch(() => setState("error"));
  }, []);
  return (
    <>
      <Hero
        eyebrow="Insights / algorithm lab"
        title="Benchmarks & tutorials"
        subtitle="Review how STANS weighs traffic, chooses routes, and turns graph theory into dependable navigation decisions."
        primary="Start a guided lesson"
        secondary="View benchmark table"
      />
      <section id="benchmarks">
        <div className="section-title">
          <Title2>
            <ChartMultipleRegular /> Algorithm benchmark
          </Title2>
          <Caption1>Median across the current city graph</Caption1>
        </div>
        <DataState state={state} onRetry={() => setState("data")}>
          <div className="card-grid">
            {data?.benchmarks.map((item) => (
              <Card key={item.algorithm}>
                <CardHeader
                  header={<Title2>{item.algorithm}</Title2>}
                  description={item.detail}
                  action={
                    <Badge
                      color={
                        item.status === "Best balance"
                          ? "success"
                          : "informative"
                      }
                    >
                      {item.status}
                    </Badge>
                  }
                />
                <Body1>
                  {item.median} median solve · {item.accuracy} accuracy
                </Body1>
              </Card>
            ))}
          </div>
        </DataState>
      </section>
      <section id="tutorials">
        <div className="section-title">
          <Title2>
            <ClockRegular /> Guided lessons
          </Title2>
        </div>
        <div className="card-grid">
          {data?.tutorials.map((lesson) => (
            <Card key={lesson.title}>
              <Badge>
                {lesson.lesson} · {lesson.duration}
              </Badge>
              <Title2>{lesson.title}</Title2>
              <Body1>{lesson.description}</Body1>
              <Button appearance="secondary">Open guided lesson</Button>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
