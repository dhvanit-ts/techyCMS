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
import { ILink } from "@/types/ILink";
import { MdDelete, MdEdit } from "react-icons/md";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "../ui/button-group";
import LinkForm from "../forms/LinkForm";
import useLinkStore from "@/store/linkStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import fetcher from "@/utils/fetcher";
import { toast } from "sonner";

type DropIndicator = {
  targetId: string;
  position: "before" | "after" | "inside";
};

function removeItem(
  items: ILink[],
  id: string
): { removed: ILink; newTree: ILink[] } | null {
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
  items: ILink[],
  Link: ILink,
  targetId: string,
  position: "before" | "after" | "inside"
): ILink[] {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === targetId) {
      if (position === "before")
        return [...items.slice(0, i), Link, ...items.slice(i)];
      if (position === "after")
        return [...items.slice(0, i + 1), Link, ...items.slice(i + 1)];
      if (position === "inside") {
        const children = [...(items[i].children ?? []), Link];
        const newItems = [...items];
        newItems[i] = { ...items[i], children };
        return newItems;
      }
    }
    if (items[i].children) {
      const childrenUpdated = insertItem(
        items[i].children!,
        Link,
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

function findItemById(items: ILink[], id: string): ILink | null {
  for (const Link of items) {
    if (Link.id === id) return Link;
    if (Link.children) {
      const found = findItemById(Link.children, id);
      if (found) return found;
    }
  }
  return null;
}

function isDescendant(parent: ILink, childId: string): boolean {
  if (parent.id === childId) return true;
  if (parent.children) {
    return parent.children.some((child) => isDescendant(child, childId));
  }
  return false;
}

type DraggableItemProps = {
  Link: ILink;
  dropIndicator: DropIndicator | null;
  activeId: string | null;
};

const DraggableItem: React.FC<DraggableItemProps> = ({
  Link,
  dropIndicator,
  activeId,
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: Link.id,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: Link.id,
    data: {
      type: "Link",
      Link: Link,
    },
  });

  const setNodeRef = (node: HTMLDivElement | null) => {
    itemRef.current = node;
    setDragRef(node);
    setDropRef(node);
    if (node) {
      node.setAttribute("data-Link-id", Link.id);
    }
  };

  const showBeforeLine =
    dropIndicator?.targetId === Link.id && dropIndicator.position === "before";
  const showAfterLine =
    dropIndicator?.targetId === Link.id && dropIndicator.position === "after";
  const showInsideHighlight =
    dropIndicator?.targetId === Link.id && dropIndicator.position === "inside";

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
          <Tab Link={Link} />
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

        {Link.children && Link.children.length > 0 && (
          <div style={{ paddingLeft: 24, marginTop: 8 }}>
            {Link.children.map((child) => (
              <DraggableItem
                key={child.id}
                Link={child}
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

const Tab = ({ Link }: { Link: ILink }) => {
  const handleDelete = async () => {
    const toastId = toast.loading("Deleting link...");
    await fetcher.delete({
      endpointPath: `/components/${Link.id}`,
      data: { id: Link.id },
      onSuccess: () => {
        toast.success("Link deleted successfully");
      },
      onError: () => toast.error("Error deleting link"),
      finallyDoThis: () => toast.dismiss(toastId),
    });
  };

  return (
    <div
      style={{ fontWeight: 500, color: "#333" }}
      className="flex justify-between relative group"
    >
      <div>
        <h4>{Link.label}</h4>
        <p className="text-zinc-600 text-xs">{Link.href}</p>
      </div>
      <div className="absolute -right-4 -top-3 opacity-0 group-hover:opacity-100 transition-all">
        <ButtonGroup
          orientation="vertical"
          className="border border-zinc-300 rounded-md"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                className="text-red-600 bg-gray-200 hover:text-zinc-100 hover:bg-red-600"
                size="icon-sm"
              >
                <MdDelete />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <ButtonGroupSeparator />
          <LinkForm link={Link} setLinks={useLinkStore((s) => s.setLinks)}>
            <Button variant="secondary" className="bg-gray-200" size="icon-sm">
              <MdEdit />
            </Button>
          </LinkForm>
        </ButtonGroup>
      </div>
    </div>
  );
};

function assignOrderRecursive(
  links: ILink[],
  parentId: string | null = null
): ILink[] {
  return links.map((link, index) => {
    const updated = {
      ...link,
      parentId,
      order: index,
      children: assignOrderRecursive(link.children || [], link.id),
    };
    return updated;
  });
}

const NestedTabsDnD = ({ sectionId }: { sectionId: string }) => {
  const items = useLinkStore((s) => s.links);
  const setItems = useLinkStore((s) => s.setLinks);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [links, setLinks] = useState<ILink[]>(items);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null
  );

  useEffect(() => {
    setLinks(items);
  }, [items]);

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

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
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

    // Get the element for the over target - use data-Link-id
    const overElement = document.querySelector(
      `[data-Link-id="${over.id}"]`
    ) as HTMLElement;
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
      const activeItem = findItemById(links, String(active.id));
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

    // Don't allow dropping an Link into itself or its descendants
    const activeItem = findItemById(links, String(active.id));
    if (activeItem && currentDropIndicator.position === "inside") {
      if (isDescendant(activeItem, String(over.id))) {
        return;
      }
    }

    const removedRes = removeItem(links, String(active.id));
    if (!removedRes) return;

    const updatedTree = insertItem(
      removedRes.newTree,
      removedRes.removed,
      currentDropIndicator.targetId,
      currentDropIndicator.position
    );

    setLinks(updatedTree);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDropIndicator(null);
  };

  const activeItem = activeId ? findItemById(links, activeId) : null;

  // Add data-id to each Link for easier lookup
  useEffect(() => {
    const addDataId = (element: HTMLElement) => {
      const id =
        element.getAttribute("data-rbd-draggable-id") ||
        element.getAttribute("data-rbd-droppable-id");
      if (id) {
        element.setAttribute("data-id", id);
      }
    };

    const observer = new MutationObserver(() => {
      document
        .querySelectorAll("[data-rbd-draggable-id], [data-rbd-droppable-id]")
        .forEach((el) => {
          addDataId(el as HTMLElement);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleUpdateLinksOrder = () => {
    const toastId = toast.loading("Updating links order...");
    try {
      const orderedLinks = assignOrderRecursive(links);

      fetcher.patch({
        endpointPath: `/links/reorder/${sectionId}`,
        data: { links: orderedLinks },
        fallbackErrorMessage: "Error updating links",
        statusShouldBe: 200,
      });

      setItems(orderedLinks);
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
      toast.success("Links updated successfully");
    }
  };

  const areListsDifferent = (a: ILink[] = [], b: ILink[] = []) => {
    if (a.length !== b.length) return true;

    for (let i = 0; i < a.length; i++) {
      if (a[i].id !== b[i].id) return true;

      const aChildren = a[i].children || [];
      const bChildren = b[i].children || [];

      if (areListsDifferent(aChildren, bChildren)) return true;
    }

    return false;
  };

  const hasChanged = areListsDifferent(links, items);

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          style={{
            width: 400,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: 20, color: "#333" }}>Nested Tabs</h2>
          {links.map((Link) => (
            <DraggableItem
              key={Link.id}
              Link={Link}
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
      {hasChanged && (
        <div className="flex gap-2 mt-4">
          <Button onClick={handleUpdateLinksOrder}>Save changes</Button>
          <Button variant="outline" onClick={() => setLinks(items)}>
            Discard changes
          </Button>
        </div>
      )}
    </>
  );
};

export default NestedTabsDnD;
