import { 
    Handle,
    NodeProps,
    Position,
    useReactFlow
} from '@xyflow/react';
import { useCallback } from 'react';
import { BaseNode } from "@/components/base-node"; // https://ui.shadcn.com/docs/installation/vite
import CopyToolbar from './CopyToolbar.tsx';

interface CustomNodeProps extends NodeProps {
}

function CustomNode ({ id, data, selected }: CustomNodeProps) {

    const reactFlow = useReactFlow();
    const node = reactFlow.getNode(id);
    const newPosition = {
        x: node?.position.x! + 20,
        y: node?.position.y! + 50
    }

    const dupeHandler = useCallback(() => {
        if (node!==undefined) {
            reactFlow.addNodes({...node!, id: `${Math.random()}-dupe}`, position: newPosition});
            console.log(node);
        }
    }, [reactFlow]);

    return (
        <div>
            {/* <CopyToolbar isSelected={selected} dupeHandler={dupeHandler}/> */}
            <BaseNode>
                <>
                  {data.label}
                  <Handle type="source" position={Position.Right} />
                  <Handle type="target" position={Position.Left} />
                </>
            </BaseNode>
        </div>
    );
}

export default CustomNode;