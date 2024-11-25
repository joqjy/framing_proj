import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  type Connection,
  type NodeChange,
  type EdgeChange,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import CustomNode from "../components/CustomNode.tsx";
import { initialEdges, initialNodes } from "./data.ts";
import { useHotkeys } from "@mantine/hooks";
import { v4 as uuid } from "uuid";

const nodeTypes = {
  customNode: CustomNode,
};

function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [nodesToCopy, setNodesToCopy] = useState<Node[]>([]);
  const [edgesToCopy, setEdgesToCopy] = useState<Edge[]>([]);

  const copyHandler = () => {
    const selectedNodes = nodes.filter(
      (node) => node.selected === true
    );

    const selectedNodeIds = selectedNodes.map((nodes) => nodes.id);

    const selectedEdges = edges.filter(
      (edge) =>
        edge.selected === true &&
        selectedNodeIds.includes(edge.source) &&
        selectedNodeIds.includes(edge.target)
    );

    if (selectedNodes.length > 0) {
      setNodesToCopy(selectedNodes);
      if (selectedEdges.length > 0) {
        setEdgesToCopy(selectedEdges);
      }
    }
  };

  const pasteHandler = () => {
    const newNodeId = uuid();

    const newNodes = nodesToCopy.map((node) => ({
      ...node,
      id: `${node.id}-${newNodeId}`,
      selected: true,
      position: { x: node.position.x + 10, y: node.position.y + 10 },
    }));
    
    setNodes(nodes
      .map((nds) => ({...nds, selected: false }))
      .concat(newNodes));

    const newEdges = edgesToCopy.map((edge) => ({
      ...edge,
      id: `${edge.id}-${newNodeId}`,
      selected: true,
      source: `${edge.source}-${newNodeId}`,
      target: `${edge.target}-${newNodeId}`,
    }));

    edges.map((edge) => ({ ...edge, selected: false}))
    setEdges((eds) => eds.concat(newEdges));
  };

  useHotkeys([
    ["mod+c", () => copyHandler()],
    ["mod+v", () => pasteHandler()],
  ]);


  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="main-canvas" style={{ width: "100vw", height: "100vh" }}>
      <button
        type="button"
        style={{ background: "white" }}
        onClick={copyHandler}
      >
        copy
      </button>
      <button
        type="button"
        style={{ background: "white" }}
        onClick={pasteHandler}
      >
        paste
      </button>
      {/* <button
        type="button"
        style={{ background: "white" }}
        onClick={undo}
        disabled={past.length === 0}
      >
        undo
      </button>
      <button
        type="button"
        style={{ background: "white" }}
        onClick={redo}
        disabled={future.length === 0}
      >
        redo
      </button> */}

      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default Canvas;
