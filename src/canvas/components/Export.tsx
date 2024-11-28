import {
	getNodesBounds,
	useReactFlow
} from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl: string) {
	const a = document.createElement('a');
	a.setAttribute('download', 'reactflow.png');
	a.setAttribute('href', dataUrl)
	a.click();
}

function ExportButton() {
	const { getNodes } = useReactFlow();
	const onClick = () => {
		const nodesBounds = getNodesBounds(getNodes());
		
		toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
			backgroundColor: 'white',
			width: nodesBounds.width + 100,
			height: nodesBounds.height + 100,
			style: {
				transform: `translate(${-nodesBounds.x + 50}px, ${-nodesBounds.y + 50}px) scale(1)`,
			},
		}).then(downloadImage);
	}

	return (
      <button 
				type="button"
				style={{ background: "white" }}
				onClick={onClick}
				>
				export
			</button>
  );
}

export default ExportButton;