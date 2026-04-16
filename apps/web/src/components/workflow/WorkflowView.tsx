import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TaskNodeComponent from './TaskNode';
import TaskEdge from './TaskEdge';
import { getLayoutedElements } from './useLayout';
import type { TaskDependency } from '@/api/dependencies';
import type { TaskNodeData } from './TaskNode';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

const nodeTypes = { task: TaskNodeComponent };
const edgeTypes = { dependency: TaskEdge };

interface WorkflowViewProps {
  tasks: any[];
  dependencies: TaskDependency[];
  onNodeClick: (taskId: number) => void;
  onConnect: (sourceTaskId: number, targetTaskId: number) => void;
  onDeleteEdge: (depId: number) => void;
  canEdit: boolean;
}

export default function WorkflowView({
  tasks,
  dependencies,
  onNodeClick,
  onConnect,
  onDeleteEdge,
  canEdit,
}: WorkflowViewProps) {
  const depIdMap = useMemo(() => {
    const map = new Map<string, number>();
    dependencies.forEach((d) => {
      map.set(`dep-${d.sourceTaskId}-${d.targetTaskId}`, d.id);
    });
    return map;
  }, [dependencies]);

  const { initialNodes, initialEdges } = useMemo(() => {
    const rawNodes: Node[] = tasks.map((t) => ({
      id: String(t.id),
      type: 'task',
      position: { x: 0, y: 0 },
      data: {
        label: t.title,
        status: t.status,
        priority: t.priority,
        taskId: t.id,
      } satisfies TaskNodeData,
    }));

    const rawEdges: Edge[] = dependencies.map((d) => ({
      id: `dep-${d.sourceTaskId}-${d.targetTaskId}`,
      source: String(d.sourceTaskId),
      target: String(d.targetTaskId),
      type: 'dependency',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
    }));

    const { nodes, edges } = getLayoutedElements(rawNodes, rawEdges);
    return { initialNodes: nodes, initialEdges: edges };
  }, [tasks, dependencies]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when tasks/deps change
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!canEdit || !connection.source || !connection.target) return;
      onConnect(Number(connection.source), Number(connection.target));
    },
    [canEdit, onConnect],
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      if (!canEdit) return;
      const depId = depIdMap.get(edgeId);
      if (depId) onDeleteEdge(depId);
    },
    [canEdit, depIdMap, onDeleteEdge],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick(Number(node.id));
    },
    [onNodeClick],
  );

  const onAutoLayout = useCallback(() => {
    const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
    );
    setNodes([...layouted]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);

  const edgesWithDeleteHandler = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        data: { ...e.data, onDelete: handleDeleteEdge },
      })),
    [edges, handleDeleteEdge],
  );

  return (
    <div className="h-[calc(100vh-14rem)] rounded-lg border bg-card">
      <ReactFlow
        nodes={nodes}
        edges={edgesWithDeleteHandler}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          className="!bg-muted !border-border"
        />
      </ReactFlow>
      <div className="absolute top-3 right-3 z-10">
        <Button size="sm" variant="outline" onClick={onAutoLayout}>
          <LayoutGrid className="w-4 h-4 mr-1" />
          Auto Layout
        </Button>
      </div>
    </div>
  );
}
