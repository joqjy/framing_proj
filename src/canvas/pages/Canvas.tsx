import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import useUndoable from "use-undoable";
import CustomNode from "../components/CustomNode.tsx";
import { initialEdges, initialNodes } from "./data.ts";
import { useHotkeys } from "@mantine/hooks";

const nodeTypes = {
  customNode: CustomNode,
};

function Canvas() {
  const [elements, setElements, { past, future, undo, redo }] = useUndoable({
    nodes: initialNodes,
    edges: initialEdges,
  });

  const [nodesToCopy, setNodesToCopy] = useState([]);
  const [edgesToCopy, setEdgesToCopy] = useState(
    elements.edges.filter((edge) => edge.selected === true)
  );

  const triggerUpdate = useCallback(
    (t: any, v: any, overwrite: boolean = false) => {
      setElements(
        (e) => ({
          nodes: t === "nodes" ? v : e.nodes,
          edges: t === "edges" ? v : e.edges,
        }),
        undefined,
        overwrite
      );
    },
    [setElements]
  );

  const copyHandler = () => {
    // get selected nodes
    const selectedNodes = elements.nodes.filter(
      (node) => node.selected === true
    );

    const selectedNodeIds = selectedNodes.map((nodes) => nodes.id);

    const selectedEdges = elements.edges.filter(
      (edge) =>
        edge.selected === true &&
        selectedNodeIds.includes(edge.source) &&
        selectedNodeIds.includes(edge.target)
    );

    if (selectedNodes.length > 0) {
      // save state
      setNodesToCopy(selectedNodes);
      // check if any edges were copied
      if (selectedEdges.length > 0) {
        setEdgesToCopy(selectedEdges);
      }
    }
  };

  const pasteHandler = useCallback(() => {
    const newNodeId = Math.floor(Math.random() * 1000) / 1000;
    // create new nodes to paste (change id and position of existing)
    const newNodes = nodesToCopy.map(
      (node) =>
        (node = {
          ...node,
          id: `${node.id}-${newNodeId}`,
          selected: false,
          position: { x: node.position.x + 10, y: node.position.y + 10 },
        })
    );
    triggerUpdate("nodes", elements.nodes.concat(newNodes));

    // create new edges to paste
    const newEdges = edgesToCopy.map(
      (edge) =>
        (edge = {
          ...edge,
          id: `${edge.id}-${newNodeId}`,
          selected: false,
          source: `${edge.source}-${newNodeId}`,
          target: `${edge.target}-${newNodeId}`,
        })
    );
    triggerUpdate("edges", elements.edges.concat(newEdges));
  }, [nodesToCopy, edgesToCopy, elements, triggerUpdate]);

  useHotkeys([
    ["mod+c", () => copyHandler()],
    ["mod+v", () => pasteHandler()],
  ]);

  const onConnect = useCallback(
    (connection: any) => {
      triggerUpdate("edges", addEdge(connection, elements.edges));
    },
    [triggerUpdate, elements.edges]
  );

  const onNodesChange = useCallback(
    (changes: any) => {
      if (
        (changes[0].type === "position" && changes[0].dragging) ||
        changes[0].type === "dimensions" ||
        changes[0].type === "select"
      ) {
        triggerUpdate("nodes", applyNodeChanges(changes, elements.nodes), true);
      } else {
        triggerUpdate("nodes", applyNodeChanges(changes, elements.nodes));
      }
    },
    [triggerUpdate, elements.nodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      triggerUpdate("edges", applyEdgeChanges(changes, elements.edges));
    },
    [triggerUpdate, elements.edges]
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
      <button
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
      </button>

      <ReactFlow
        nodes={elements.nodes}
        nodeTypes={nodeTypes}
        edges={elements.edges}
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
