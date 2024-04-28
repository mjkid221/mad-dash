import { arrayMoveImmutable } from "array-move";
import { ReactNode, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";

export interface GridItem {
  id: string;
  child: ReactNode;
}

export const DraggableGrid = ({ gridItems }: { gridItems: GridItem[] }) => {
  const [items, setItems] = useState<GridItem[]>(gridItems);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  return (
    <SortableList
      onSortEnd={onSortEnd}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))",
        gap: "8px",
        justifyItems: "center",
      }}
    >
      {items.map(({ id, child }) => (
        <SortableItem key={id}>
          <div className="item">{child}</div>
        </SortableItem>
      ))}
    </SortableList>
  );
};
