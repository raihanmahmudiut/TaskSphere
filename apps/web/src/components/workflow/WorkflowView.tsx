import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
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
import { useBlockedTasks } from '@/hooks/useBlockedTasks';
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

  const blockedMap = useBlockedTasks(tasks, dependencies);

  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    const rawNodes: Node[] = tasks.map((t) => {
      const blocked = blockedMap.get(t.id);
      return {
        id: String(t.id),
        type: 'task',
        position: { x: 0, y: 0 },
        data: {
          label: t.title,
          status: t.status,
          priority: t.priority,
          taskId: t.id,
          isBlocked: blocked?.isBlocked ?? false,
          blockedByTitles: blocked?.blockedByTitles ?? [],
        } satisfies TaskNodeData,
      };
    });

    const rawEdges: Edge[] = dependencies.map((d) => ({
      id: `dep-${d.sourceTaskId}-${d.targetTaskId}`,
      source: String(d.sourceTaskId),
      target: String(d.targetTaskId),
      type: 'dependency',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
    }));

    const { nodes, edges } = getLayoutedElements(rawNodes, rawEdges);
    return { layoutedNodes: nodes, layoutedEdges: edges };
  }, [tasks, dependencies, blockedMap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!canEdit || !connection.source || !connection.target) return;
      if (connection.source === connection.target) return;

      const optimisticEdge: Edge = {
        id: `dep-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'dependency',
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, opacity: 0.5 },
      };
      setEdges((prev) => addEdge(optimisticEdge, prev));

      onConnect(Number(connection.source), Number(connection.target));
    },
    [canEdit, onConnect, setEdges],
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
    const { nodes: laid, edges: laidEdges } = getLayoutedElements(nodes, edges);
    setNodes([...laid]);
    setEdges([...laidEdges]);
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
    <div className="relative h-[calc(100vh-14rem)] rounded-lg border bg-card workflow-canvas">
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
