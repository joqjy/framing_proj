import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { ReactFlow, addEdge, Background, BackgroundVariant, applyNodeChanges, applyEdgeChanges, useKeyPress} from '@xyflow/react';
import useUndoable from 'use-undoable';
import CustomNode from '../components/CustomNode.tsx';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, selected: false, type: 'customNode', data: { label: 'question'} },
  { id: '2', position: { x: 100, y: 200 }, selected: false, type: 'customNode', data: { label: 'answer'} },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', selected: false }];

const nodeTypes = {
    customNode: CustomNode,
};


function Canvas () {
    const [elements, setElements, { past, future, undo, redo }] = useUndoable({nodes: initialNodes, edges: initialEdges});
    const [nodesToCopy, setNodesToCopy] = useState(elements.nodes.filter((node) => node.selected==true));
    const [edgesToCopy, setEdgesToCopy] = useState(elements.edges.filter((edge) => edge.selected==true));
    
    const ctrlc = useKeyPress(['Control+c']);
    const ctrlv = useKeyPress(['Control+v']);

    const keyPressHandler = () => {
        if (ctrlc) {
            copyHandler();
        }
        if (ctrlv) {
            pasteHandler();
        }
    }

    const triggerUpdate = useCallback((t: any, v: any, overwrite: boolean = false) => {
        setElements(e => ({
            nodes: t === 'nodes' ? v : e.nodes,
            edges: t === 'edges' ? v : e.edges,
        }), undefined, overwrite);
    }, [setElements, past, future]);


    const onConnect = useCallback((connection: any) => {
        triggerUpdate('edges', addEdge(connection, elements.edges));
    }, [triggerUpdate, elements.edges]);

    const onNodesChange = useCallback((changes: any) => {
        if ((changes[0].type == 'position' && changes[0].dragging) || (changes[0].type == 'dimensions') || (changes[0].type == 'select')) {
            triggerUpdate('nodes', applyNodeChanges(changes, elements.nodes), true);
        }
        else {
            triggerUpdate('nodes', applyNodeChanges(changes, elements.nodes));
            console.log(changes);
            console.log(past);
        }
    },[triggerUpdate, elements.nodes]);

    const onEdgesChange = useCallback((changes: any) => {
		triggerUpdate('edges', applyEdgeChanges(changes, elements.edges));
	},[triggerUpdate, elements.edges]);


    const copyHandler = () => {
        // get selected nodes
        let selectedNodes = elements.nodes.filter((node) => node.selected==true);
        let selectedNodeIds = selectedNodes.map((nodes) => nodes.id);
        console.log(selectedNodeIds)

        let selectedEdges = elements.edges.filter((edge) => edge.selected==true && selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target));
        if (selectedNodes.length > 0) {
            // save state
            setNodesToCopy(selectedNodes);
            console.log("Nodes copied successfully!")

            // check if any edges were copied
            if (selectedEdges.length > 0) {
                setEdgesToCopy(selectedEdges);
                console.log("Edges copied successfully!")
            }
        }
    }

    const pasteHandler = useCallback(() => {
        let newNodeId = Math.floor(Math.random() * 1000)/1000;
        // create new nodes to paste (change id and position of existing)
        const newNodes = nodesToCopy.map((node) => node = {...node, id: `${node.id}-${newNodeId}`, selected: false, position: {x: node.position.x + 10, y: node.position.y + 10}});
        triggerUpdate('nodes', elements.nodes.concat(newNodes));
        console.log(newNodes);

        // create new edges to paste
        const newEdges = edgesToCopy.map((edge) => edge = {...edge, id: `${edge.id}-${newNodeId}`, selected: false, source: `${edge.source}-${newNodeId}`, target: `${edge.target}-${newNodeId}`})
        triggerUpdate('edges', elements.edges.concat(newEdges));
        console.log(newEdges);
    }, [nodesToCopy, edgesToCopy, elements])


    const onNodeDragStop = (event: any, node: any) => {
        console.log('drag stop', node);
    }

    const onNodeDragStart = (event: any, node: any) => {
        console.log('drag start', node);
    }

    const undoHandler = () => {
        undo();
        console.log("undoing..")
        console.log(past);
        console.log(future);
    }

    const redoHandler = () => {
        redo();
        console.log("redoing..")
        console.log(past);
        console.log(future);
    }

    return (
        <div className='main-canvas' style={{ width: '100vw', height: '100vh'}}>
            <button onClick={copyHandler} >copy</button>
            <button onClick={pasteHandler}>paste</button>
            <button onClick={undoHandler} disabled={(past.length==0)}>undo</button>
            <button onClick={redoHandler} disabled={(future.length==0)}>redo</button>
            
            <ReactFlow 
                nodes={elements.nodes}
                nodeTypes={nodeTypes}
                edges={elements.edges}

                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                onNodeDragStart={onNodeDragStart}
                onKeyUp={keyPressHandler}
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}

export default Canvas;