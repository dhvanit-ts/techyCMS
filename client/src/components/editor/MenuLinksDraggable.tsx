import React, { useState, useRef, useEffect, ReactNode, forwardRef, ButtonHTMLAttributes } from "react";
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
import useLinkStore from "@/store/linkStore";
import { ILink } from "@/types/ILink";
import { Button } from "../ui/button";
import fetcher from "@/utils/fetcher";
import { MdDelete, MdEdit } from "react-icons/md";
import LinkForm from "../forms/LinkForm";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Spinner } from "../ui/spinner";
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
  const setLinks = useLinkStore(s => s.setLinks)

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
    <div style={{ marginBottom: 0 }}>
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
        <div style={style} className="group hover:!bg-gradient-to-r hover:!from-[#f5f5f5] via-[#f5f5f5] hover:!to-zinc-200/80" {...attributes} {...listeners}>
          <div style={{ fontWeight: 500, color: "#333" }}>
            <div>
              <h4 style={{ margin: 0 }}>{Link.label}</h4>
              <p
                style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}
              >
                {Link.href}
              </p>
            </div>
          </div>
          <div className="absolute opacity-0 group-hover:opacity-100 transition-colors duration-150 pr-4 gap-0.5 flex justify-center items-center right-0 top-0 rounded-r h-full">
            <LinkForm link={Link} setLinks={setLinks}>
              <ActionButton>
                <MdEdit size={16} />
              </ActionButton>
            </LinkForm>
            <ToggleVisibilityButton Link={Link} />
            <DeleteTab Link={Link} />
          </div>
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

      {showAfterLine && (
        <div
          style={{
            height: "3px",
            background: "#2196f3",
            borderRadius: "2px",
            marginTop: "8px",
            marginBottom: "8px",
            boxShadow: "0 0 4px rgba(33, 150, 243, 0.5)",
          }}
        />
      )}
    </div>
  );
};

const DeleteTab = ({ Link }: { Link: ILink }) => {
  const [open, setOpen] = useState(false)
  const removeLink = useLinkStore(s => s.removeLink)

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting tab...")
    try {
      await fetcher.delete({
        endpointPath: `/links/${Link.id}`,
        data: {},
        onSuccess: () => {
          removeLink(Link.id)
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      setOpen(false)
      toast.dismiss(toastId)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <ActionButton className="text-zinc-700 hover:bg-red-500 hover:text-zinc-100">
          <MdDelete size={16} />
        </ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tab</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this tab? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete} variant="destructive">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const ToggleVisibilityButton = ({ Link }: { Link: ILink }) => {

  const [isLoading, setIsLoading] = useState(false)

  const updateLinkVisibilityStatus = useLinkStore(s => s.updateLinkVisibilityStatus)

  const handleChangeVisibility = async () => {
    try {
      setIsLoading(true)
      await fetcher.patch({
        endpointPath: `/links/${Link.id}/visibility`,
        data: { active: !Link.active },
        onSuccess: () => {
          updateLinkVisibilityStatus(Link.id)
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };
  return (
    <ActionButton onClick={handleChangeVisibility}>
      {isLoading ? <Spinner /> : (Link.active ? <IoMdEye size={16} /> : <IoMdEyeOff size={16} />)}
    </ActionButton>
  )
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex justify-center items-center size-10 rounded-full active:translate-y-0 active:shadow-md hover:-translate-y-0.5 hover:shadow-lg text-zinc-700 hover:bg-zinc-100 hover:text-zinc-800 transition-all cursor-pointer",
          className
        )}
        {...props} // <-- crucial
      >
        {children}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

function flattenLinksForAPI(links: ILink[]): Omit<ILink, "children">[] {
  const result: Omit<ILink, "children">[] = [];

  function flatten(items: ILink[], parentId: string | null = null) {
    items.forEach((item, index) => {
      const { children, ...itemWithoutChildren } = item;
      result.push({
        ...itemWithoutChildren,
        parentId,
        order: index,
      });

      if (children && children.length > 0) {
        flatten(children, item.id);
      }
    });
  }

  flatten(links);
  return result;
}

const NestedTabsDnD = ({ sectionId }: { sectionId: string }) => {
  const items = useLinkStore((s) => s.links);
  const setItems = useLinkStore((s) => s.setLinks);
  const [links, setLinks] = useState<ILink[]>(items);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null
  );

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

    const overElement = document.querySelector(
      `[data-Link-id="${over.id}"]`
    ) as HTMLElement;
    if (!overElement) {
      setDropIndicator(null);
      return;
    }

    const contentElement = overElement.firstElementChild as HTMLElement;
    if (!contentElement) {
      setDropIndicator(null);
      return;
    }

    const rect = contentElement.getBoundingClientRect();
    const mouseY = pointerPosRef.current.y;

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

  const handleSaveChanges = () => {
    const flattenedLinks = flattenLinksForAPI(links);
    fetcher.patch({
      endpointPath: `/links/reorder/${sectionId}`,
      data: { links: flattenedLinks },
      fallbackErrorMessage: "Error updating links",
      statusShouldBe: 200,
    });

    setItems(flattenedLinks);
  };

  const handleDiscardChanges = () => {
    setLinks(items);
  };

  const areListsDifferent = (a: ILink[], b: ILink[]): boolean => {
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

  useEffect(() => {
    setLinks(items);
  }, [items])

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
            width: "100%",
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "fit-content",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 20, color: "#333" }}>
            Nested Tabs
          </h2>
          {links.length > 0 ? links.map((Link) => (
            <DraggableItem
              key={Link.id}
              Link={Link}
              dropIndicator={dropIndicator}
              activeId={activeId}
            />
          )) : (
            <p className="text-sm text-zinc-600">
              No nested tabs available
            </p>
          )}
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
        <div className="mt-4 flex gap-2">
          <Button onClick={handleSaveChanges}>Save changes</Button>
          <Button onClick={handleDiscardChanges} variant="outline">
            Discard changes
          </Button>
        </div>
      )}
    </>
  );
};

export default NestedTabsDnD;
