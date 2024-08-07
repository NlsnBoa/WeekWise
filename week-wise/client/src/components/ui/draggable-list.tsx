import React from 'react';
import { motion, Reorder } from 'framer-motion';

interface ListItem {
  id: number;
  text: string;
}

const initialItems: ListItem[] = [
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' },
  { id: 4, text: 'Item 4' },
];

const DraggableList: React.FC = () => {
  const [items, setItems] = React.useState(initialItems);

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="flex flex-col space-y-2 p-4"
    >
      {items.map(item => (
        <Reorder.Item
          key={item.id}
          value={item}
          className="bg-blue-500 text-white p-4 rounded shadow-md cursor-pointer"
        >
          {item.text}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default DraggableList;
