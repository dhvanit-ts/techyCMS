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
import { IPage } from "@/types/IPage";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

function DeletePage({
  children,
  slug,
  setPages,
}: {
  children: React.ReactNode;
  slug: string;
  setPages: Dispatch<SetStateAction<IPage[]>>;
}) {
  const [typedSlug, setTypedSlug] = useState("");

  const deletePage = async () => {
    const toastId = toast.loading("Deleting page...");
    try {
      await fetcher.delete({
        endpointPath: `/pages/${slug}`,
        data: { slug },
        onSuccess: () => {
          setPages((prevPages) => prevPages.filter((p) => p.slug !== slug));
          toast.success("Page deleted successfully");
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
            This action cannot be undone. This will permanently delete the page
            with <span className="text-red-600 font-semibold">{slug}</span>{" "}
            slug. Type the page slug below to confirm.
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
              onClick={deletePage}
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

export default DeletePage;
