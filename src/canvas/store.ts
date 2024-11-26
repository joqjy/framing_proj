import { create } from 'zustand';
import { temporal } from 'zundo';
import { initialEdges, initialNodes } from './pages/data';
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
} from '@xyflow/react';
import { type AppState } from './types.ts';

const useStore = create<AppState>()(
  temporal((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes) => {
			set({
				nodes: applyNodeChanges(changes, get().nodes)
			});
			return changes;
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
  }),
	{
		partialize: (state) => {
			const { nodes, edges } = state;
			return { nodes, edges };
		}
	}
));

// const useTemporalStore = () => {
// 	return {
// 		...useStore.temporal.getState(),
// 		undo: () => {
			
// 		}
// 	}
// }

export default useStore;