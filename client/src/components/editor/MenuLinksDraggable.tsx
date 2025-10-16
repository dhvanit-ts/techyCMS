import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";

type Item = {
  id: string;
  label: string;
  children?: Item[];
};

type DropIndicator = {
  targetId: string;
  position: "before" | "after" | "inside";
};

// --- Utility functions ---
function removeItem(
  items: Item[],
  id: string
): { removed: Item; newTree: Item[] } | null {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      const removed = items[i];
      const newTree = [...items.slice(0, i), ...items.slice(i + 1)];
      return { removed, newTree };
    }
    if (items[i].children) {
      const res = removeItem(items[i].children!, id);
      if (res) {
        const newChildren = res.newTree;
        const newTree = [...items];
        newTree[i] = { ...items[i], children: newChildren };
        return { removed: res.removed, newTree };
      }
    }
  }
  return null;
}

function insertItem(
  items: Item[],
  item: Item,
  targetId: string,
  position: "before" | "after" | "inside"
): Item[] {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === targetId) {
      if (position === "before")
        return [...items.slice(0, i), item, ...items.slice(i)];
      if (position === "after")
        return [...items.slice(0, i + 1), item, ...items.slice(i + 1)];
      if (position === "inside") {
        const children = [...(items[i].children ?? []), item];
        const newItems = [...items];
        newItems[i] = { ...items[i], children };
        return newItems;
      }
    }
    if (items[i].children) {
      const childrenUpdated = insertItem(
        items[i].children!,
        item,
        targetId,
        position
      );
      if (childrenUpdated !== items[i].children) {
        const newItems = [...items];
        newItems[i] = { ...items[i], children: childrenUpdated };
        return newItems;
      }
    }
  }
  return items;
}

function findItemById(items: Item[], id: string): Item | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function isDescendant(parent: Item, childId: string): boolean {
  if (parent.id === childId) return true;
  if (parent.children) {
    return parent.children.some(child => isDescendant(child, childId));
  }
  return false;
}

// --- Draggable Item ---
type DraggableItemProps = {
  item: Item;
  dropIndicator: DropIndicator | null;
  activeId: string | null;
};

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  dropIndicator,
  activeId,
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);
  
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: item.id,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: item.id,
    data: {
      type: 'item',
      item: item
    }
  });

  const setNodeRef = (node: HTMLDivElement | null) => {
    itemRef.current = node;
    setDragRef(node);
    setDropRef(node);
    if (node) {
      node.setAttribute('data-item-id', item.id);
    }
  };

  const showBeforeLine = dropIndicator?.targetId === item.id && dropIndicator.position === "before";
  const showAfterLine = dropIndicator?.targetId === item.id && dropIndicator.position === "after";
  const showInsideHighlight = dropIndicator?.targetId === item.id && dropIndicator.position === "inside";

  const style: React.CSSProperties = {
    padding: "12px 16px",
    marginBottom: "8px",
    background: showInsideHighlight ? "#e3f2fd" : "#f5f5f5",
    border: isDragging ? "2px dashed #999" : "1px solid #ddd",
    borderRadius: "6px",
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    position: "relative",
    opacity: isDragging ? 0.5 : 1,
    transition: "background 0.2s, border 0.2s",
  };

  return (
    <>
      {showBeforeLine && (
        <div
          style={{
            height: "3px",
            background: "#2196f3",
            borderRadius: "2px",
            marginBottom: "8px",
            boxShadow: "0 0 4px rgba(33, 150, 243, 0.5)",
          }}
        />
      )}
      <div ref={setNodeRef}>
        <div style={style} {...attributes} {...listeners}>
          <div style={{ fontWeight: 500, color: "#333" }}>{item.label}</div>
          
          {showInsideHighlight && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "2px solid #2196f3",
                borderRadius: "6px",
                pointerEvents: "none",
                background: "rgba(33, 150, 243, 0.1)",
              }}
            />
          )}
        </div>
        
        {item.children && item.children.length > 0 && (
          <div style={{ paddingLeft: 24, marginTop: 8 }}>
            {item.children.map((child) => (
              <DraggableItem
                key={child.id}
                item={child}
                dropIndicator={dropIndicator}
                activeId={activeId}
              />
            ))}
          </div>
        )}
      </div>
      {showAfterLine && (
        <div
          style={{
            height: "3px",
            background: "#2196f3",
            borderRadius: "2px",
            marginBottom: "8px",
            boxShadow: "0 0 4px rgba(33, 150, 243, 0.5)",
          }}
        />
      )}
    </>
  );
};

// --- Main Component ---
const NestedTabsDnD: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", label: "Tab 1", children: [
      { id: "1-1", label: "Tab 1-1" },
      { id: "1-2", label: "Tab 1-2" }
    ]},
    { id: "2", label: "Tab 2" },
    { id: "3", label: "Tab 3", children: [
      { id: "3-1", label: "Tab 3-1" },
      { id: "3-2", label: "Tab 3-2" }
    ]},
    { id: "4", label: "Tab 4" },
  ]);
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const pointerPosRef = useRef({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event;
    
    if (!over || over.id === active.id) {
      setDropIndicator(null);
      return;
    }

    // Get the element for the over target - use data-item-id
    const overElement = document.querySelector(`[data-item-id="${over.id}"]`) as HTMLElement;
    if (!overElement) {
      setDropIndicator(null);
      return;
    }

    // Get only the content area rect (not including children)
    const contentElement = overElement.firstElementChild as HTMLElement;
    if (!contentElement) {
      setDropIndicator(null);
      return;
    }
    
    const rect = contentElement.getBoundingClientRect();
    const mouseY = pointerPosRef.current.y;
    
    // Check if mouse is within the content area bounds
    if (mouseY < rect.top || mouseY > rect.bottom) {
      setDropIndicator(null);
      return;
    }
    
    const relativeY = mouseY - rect.top;
    const heightThird = rect.height / 3;

    let position: "before" | "after" | "inside";
    
    if (relativeY < heightThird) {
      position = "before";
    } else if (relativeY > rect.height - heightThird) {
      position = "after";
    } else {
      position = "inside";
    }

    // Check if trying to drop into self or descendant
    if (position === "inside") {
      const activeItem = findItemById(items, String(active.id));
      if (activeItem && isDescendant(activeItem, String(over.id))) {
        setDropIndicator(null);
        return;
      }
    }

    setDropIndicator({
      targetId: String(over.id),
      position,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    const currentDropIndicator = dropIndicator;
    setDropIndicator(null);

    if (!over || !currentDropIndicator || active.id === over.id) return;

    // Don't allow dropping an item into itself or its descendants
    const activeItem = findItemById(items, String(active.id));
    if (activeItem && currentDropIndicator.position === "inside") {
      if (isDescendant(activeItem, String(over.id))) {
        return;
      }
    }

    const removedRes = removeItem(items, String(active.id));
    if (!removedRes) return;

    const updatedTree = insertItem(
      removedRes.newTree,
      removedRes.removed,
      currentDropIndicator.targetId,
      currentDropIndicator.position
    );
    
    setItems(updatedTree);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDropIndicator(null);
  };

  const activeItem = activeId ? findItemById(items, activeId) : null;

  // Add data-id to each item for easier lookup
  useEffect(() => {
    const addDataId = (element: HTMLElement) => {
      const id = element.getAttribute('data-rbd-draggable-id') || 
                 element.getAttribute('data-rbd-droppable-id');
      if (id) {
        element.setAttribute('data-id', id);
      }
    };

    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-rbd-draggable-id], [data-rbd-droppable-id]').forEach(el => {
        addDataId(el as HTMLElement);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div style={{ 
        width: 400, 
        padding: 24, 
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: 20, color: "#333" }}>Nested Tabs</h2>
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            dropIndicator={dropIndicator}
            activeId={activeId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div
            style={{
              padding: "12px 16px",
              background: "#fff",
              border: "2px solid #2196f3",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontWeight: 500,
            }}
          >
            {activeItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default NestedTabsDnD;