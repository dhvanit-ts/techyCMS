import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

function TooltipWrapper({
  children,
  tooltip,
  ...props
}: {
  children: React.ReactNode;
  tooltip: string;
} & React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default TooltipWrapper;
