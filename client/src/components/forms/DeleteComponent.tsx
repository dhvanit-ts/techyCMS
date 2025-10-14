import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IComponent } from "@/types/IComponent";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

function DeleteComponent({
  children,
  id,
  name,
  setComponents,
}: {
  children: React.ReactNode;
  id: string;
  name:string
  setComponents: Dispatch<SetStateAction<IComponent[]>>;
}) {
  const [typedName, setTypedName] = useState("");

  const DeleteComponent = async () => {
    const toastId = toast.loading("Deleting page...");
    try {
      await fetcher.delete({
        endpointPath: `/components/${id}`,
        data: { id },
        onSuccess: () => {
          setComponents((prevComponents) => prevComponents.filter((c) => c.name !== name));
          toast.success("Page deleted successfully")
        },
      });
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as AxiosError).message || "Failed to delete page");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the component
            with <span className="text-red-600 font-semibold">{name}</span>{" "}
            name. Type the component name below to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="slug" className="sr-only">
              Slug
            </Label>
            <Input
              spellCheck={false}
              autoComplete="off"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              id="slug"
              placeholder={name}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={name !== typedName}
              type="button"
              variant="destructive"
              onClick={DeleteComponent}
            >
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteComponent;
