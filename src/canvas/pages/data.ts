import { Node, Edge } from '@xyflow/react';

export const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    selected: false,
    type: "customNode",
    data: { label: "question" },
  },
  {
    id: "2",
    position: { x: 100, y: 200 },
    selected: false,
    type: "customNode",
    data: { label: "answer" },
  },
] as Node[];

export const initialEdges = [
  { id: "e1-2", source: "1", target: "2", selected: false },
] as Edge[];
