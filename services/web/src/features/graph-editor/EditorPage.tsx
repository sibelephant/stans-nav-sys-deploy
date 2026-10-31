import { useEffect, useState } from "react";
import {
  Badge,
  Body1,
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
  const [state, setState] = useState<ViewState>("loading");
  const [nodeName, setNodeName] = useState("Central Station");
  const [trafficWeight, setTrafficWeight] = useState("1.15");
  const [saved, setSaved] = useState(false);
  const [weightError, setWeightError] = useState("");

  const loadEditor = () => {
    setState("loading");
    api
      .getEditor()
      .then((nextData) => {
        setData(nextData);
        setState(nextData.nodes.length || nextData.templates.length ? "data" : "empty");
      })
      .catch(() => setState("error"));
  };

  const handleWeightChange = (_: unknown, event: { value: string }) => {
    setTrafficWeight(event.value);
    setSaved(false);
    const num = Number(event.value);
    if (event.value === "" || Number.isNaN(num)) {
      setWeightError("Must be a number");
    } else if (num <= 0) {
      setWeightError("Must be greater than 0");
    } else {
      setWeightError("");
    }
  };

  const handleSave = () => {
    if (weightError || !nodeName.trim()) return;
    setSaved(true);
  };

  useEffect(loadEditor, []);
  return (
    <>
      <Hero
        eyebrow="Graph control plane / editor"
        title="Shape the network behind every route."
        subtitle="Inspect nodes, tune traffic weights, and keep reusable graph templates ready for the next navigation run."
        primary="Add a named node"
        secondary="Browse templates"
        primaryTo="#edit-node"
        secondaryTo="#templates"
      />
      <div className="flex items-baseline justify-between gap-3 mb-2.5">
        <Title2 className="inline-flex items-center gap-2">
          <MapRegular /> Graph editor
        </Title2>
        <Badge>Draft changes: 2</Badge>
      </div>
      <DataState state={state} onRetry={loadEditor}>
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] gap-5">
          <Card className="p-4 overflow-x-auto" id="network-nodes">
            <CardHeader header={<Title2>Network nodes</Title2>} />
            <Table aria-label="Network nodes" className="min-w-[650px]!">
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
          <Card className="p-4 grid gap-4" id="edit-node">
            <CardHeader
              header={
                <Title2 className="inline-flex items-center gap-2">
                  <EditRegular /> Edit node
                </Title2>
              }
            />
            <Field
              label="Node name"
              validationState={!nodeName.trim() ? "error" : "none"}
              validationMessage={!nodeName.trim() ? "Name is required" : undefined}
            >
              <Input value={nodeName} onChange={(_, event) => { setNodeName(event.value); setSaved(false); }} />
            </Field>
            <Field
              label="Traffic weight"
              validationState={weightError ? "error" : "none"}
              validationMessage={weightError || undefined}
            >
              <Input value={trafficWeight} onChange={handleWeightChange} />
            </Field>
            <Button
              appearance="primary"
              icon={<SaveRegular />}
              onClick={handleSave}
              disabled={!!weightError || !nodeName.trim()}
            >
              {saved ? "Changes saved ✓" : "Save node changes"}
            </Button>
          </Card>
        </section>
        <section id="templates">
          <div className="flex items-baseline justify-between gap-3 mb-2.5">
            <Title2 className="inline-flex items-center gap-2">Graph templates</Title2>
            <Caption1 className="text-[var(--colorNeutralForeground3)]">Reusable starting graphs</Caption1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data?.templates.map((tmpl) => (
              <Card key={tmpl.title} className="grid gap-3 p-4">
                <CardHeader
                  header={<Title2>{tmpl.title}</Title2>}
                  description={tmpl.meta}
                />
                <Body1>{tmpl.body}</Body1>
              </Card>
            ))}
          </div>
        </section>
      </DataState>
    </>
  );
}
