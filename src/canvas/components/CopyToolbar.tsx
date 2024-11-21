import { NodeToolbar } from '@xyflow/react';

interface CopyToolbar {
    isSelected: boolean | undefined,
    dupeHandler: () => void,
}


function CopyToolbar ({ isSelected, dupeHandler }: CopyToolbar) {
    return (
        <>
            <NodeToolbar isVisible={isSelected}>
                <button type="button" onClick={dupeHandler}>duplicate</button>
            </NodeToolbar>
        </>
    );
};

export default CopyToolbar;