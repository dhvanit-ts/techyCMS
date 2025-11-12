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
import { IBlog } from "@/types/IBlog";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

function DeleteBlog({
  children,
  slug,
  setBlogs,
}: {
  children: React.ReactNode;
  slug: string;
  setBlogs: Dispatch<SetStateAction<IBlog[]>>;
}) {
  const [typedSlug, setTypedSlug] = useState("");

  const DeleteBlog = async () => {
    const toastId = toast.loading("Deleting blog...");
    try {
      await fetcher.delete({
        endpointPath: `/blogs/${slug}`,
        data: { slug },
        onSuccess: () => {
          setBlogs((prevComponents) => prevComponents.filter((c) => c.slug !== slug));
          toast.success("Page deleted successfully")
        },
      });
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as AxiosError).message || "Failed to delete blog");
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
            with <span className="text-red-600 font-semibold">{slug}</span>{" "}
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
              value={typedSlug}
              onChange={(e) => setTypedSlug(e.target.value)}
              id="slug"
              placeholder={slug}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={slug !== typedSlug}
              type="button"
              variant="destructive"
              onClick={DeleteBlog}
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

export default DeleteBlog;
