import { create } from 'zustand';
import { initialEdges, initialNodes } from './pages/data';
import { 
    addEdge, 
    applyNodeChanges, 
    applyEdgeChanges,
} from '@xyflow/react';
import { type AppState } from './types.ts';


const useStore = create<AppState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes)
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges)
        });
    },
    onConnect: (connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    setNodes: (nodes) => {
        set({ nodes });
    },
    setEdges: (edges) => {
        set({ edges });
    },

    nodesToCopy: [],
    edgesToCopy: [],
    setNodesToCopy: (nodesToCopy) => {
        set({ nodesToCopy })
    },
    setEdgesToCopy: (edgesToCopy) => {
        set({ edgesToCopy })
    },
}));

export default useStore;

// const [nodesToCopy, setNodesToCopy] = useState<Node[]>([]);
// const [edgesToCopy, setEdgesToCopy] = useState<Edge[]>([]);