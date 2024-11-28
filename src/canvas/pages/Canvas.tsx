import "@xyflow/react/dist/style.css";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import CustomNode from "../components/CustomNode.tsx";
import ExportButton from "../components/Export.tsx";
import { useHotkeys } from "@mantine/hooks";
import { v4 as uuid } from "uuid";
import useStore from '../store';

const nodeTypes = {
  customNode: CustomNode,
};

function Canvas() {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const nodesToCopy = useStore((state) => state.nodesToCopy);
  const edgesToCopy = useStore((state) => state.edgesToCopy);
  const { setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, setNodesToCopy, setEdgesToCopy} = useStore();
  const { undo, redo, pause, resume } = useStore.temporal.getState();

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

    setEdges(edges
      .map((eds) => ({...eds, selected: false }))
      .concat(newEdges));
  };

  useHotkeys([
    ["mod+c", () => copyHandler()],
    ["mod+v", () => pasteHandler()],
  ]);

  const onNodeDragStart = () => {
    pause();
  }

  const onNodeDragStop = () => {
    resume();
  }

  const onNodeClick = () => {
    pause();
  }

  const onSelectionEnd = () => {
    resume();
  }
  

  return (
    <div className="main-canvas" style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onSelectionEnd={onSelectionEnd}
      >
        <Panel>
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
            onClick={() => undo()}
          >
            undo
          </button>
          <button
            type="button"
            style={{ background: "white" }}
            onClick={() => redo()}
          >
            redo
          </button>
          <ExportButton/>
        </Panel>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default Canvas;
