import type { ReactNode } from "react";
import {
  Button,
  Card,
  MessageBar,
  MessageBarBody,
  MessageBarActions,
  Skeleton,
  SkeletonItem,
  Title3,
  Body1,
} from "@fluentui/react-components";
import {
  ArrowClockwiseRegular,
  BoxRegular,
  DatabaseSearchRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import type { ViewState } from "../api";

export function DataState({
  state,
  children,
  onRetry,
}: {
  state: ViewState;
  children: ReactNode;
  onRetry?: () => void;
}) {
  if (state === "loading")
    return (
      <div className="state-stack" aria-label="Loading data">
        <Skeleton>
          <SkeletonItem size={24} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
        </Skeleton>
        <Skeleton>
          <SkeletonItem size={24} />
          <SkeletonItem size={16} />
          <SkeletonItem size={16} />
        </Skeleton>
      </div>
    );
  if (state === "error")
    return (
      <MessageBar intent="error">
        <ErrorCircleRegular />
        <MessageBarBody>
          <strong>Comparison stream unavailable</strong>
          <br />
          Existing graph data is still current.
        </MessageBarBody>
        <MessageBarActions>
          <Button icon={<ArrowClockwiseRegular />} onClick={onRetry}>
            Retry benchmark data
          </Button>
        </MessageBarActions>
      </MessageBar>
    );
  if (state === "empty")
    return (
      <Card className="empty-state">
        <BoxRegular className="empty-icon" />
        <Title3>No route records yet</Title3>
        <Body1>Run a calculation to create the first route comparison.</Body1>
        <Button appearance="primary" icon={<DatabaseSearchRegular />}>
          Calculate first route
        </Button>
      </Card>
    );
  return <>{children}</>;
}
