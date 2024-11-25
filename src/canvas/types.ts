import {
    type Edge,
    type Node,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
} from '@xyflow/react';

export type AppState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange<Node>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;

    nodesToCopy: Node[],
    edgesToCopy: Edge[],
    setNodesToCopy: (nodesToCopy: Node[]) => void;
    setEdgesToCopy: (edgesToCopy: Edge[]) => void;
};