import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Caption1,
  Field,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title2,
} from "@fluentui/react-components";
import { EditRegular, MapRegular, SaveRegular } from "@fluentui/react-icons";
import { api, type EditorData, type ViewState } from "../../api";
import { DataState } from "../../components/States";
import { Hero } from "../../components/Hero";

export function EditorPage() {
  const [data, setData] = useState<EditorData | null>(null);
  const [state, setState] = useState<ViewState>("data");
  useEffect(() => {
    const load = () =>
      api
        .getEditor()
        .then(setData)
        .catch(() => setState("error"));
    load();
    return api.subscribeToChanges((table) => {
      if (["nodes", "templates"].includes(table)) load();
    });
  }, []);
  return (
    <>
      <Hero
        eyebrow="Graph control plane / editor"
        title="Shape the network behind every route."
        subtitle="Inspect nodes, tune traffic weights, and keep reusable graph templates ready for the next navigation run."
        primary="Add a named node"
        secondary="Browse templates"
      />
      <div className="section-title">
        <Title2>
          <MapRegular /> Graph editor
        </Title2>
        <Badge>Draft changes: 2</Badge>
      </div>
      <DataState state={state} onRetry={() => setState("data")}>
        <section className="two-column">
          <Card className="table-card">
            <CardHeader header={<Title2>Network nodes</Title2>} />
            <Table aria-label="Network nodes">
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Node</TableHeaderCell>
                  <TableHeaderCell>Coordinates</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.nodes.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell>
                      <strong>{node.name}</strong>
                      <br />
                      <Caption1>{node.id}</Caption1>
                    </TableCell>
                    <TableCell>{node.coordinates}</TableCell>
                    <TableCell>
                      <Badge
                        color={node.state === "Active" ? "success" : "warning"}
                      >
                        {node.state}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Card className="form-card">
            <CardHeader
              header={
                <Title2>
                  <EditRegular /> Edit node
                </Title2>
              }
            />
            <Field label="Node name">
              <Input defaultValue="Central Station" />
            </Field>
            <Field label="Traffic weight">
              <Input defaultValue="1.15" />
            </Field>
            <Button appearance="primary" icon={<SaveRegular />}>
              Save node changes
            </Button>
          </Card>
        </section>
      </DataState>
    </>
  );
}
