"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";

export function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} {...props}>
      {pending ? "Loading..." : props.children}
    </Button>
  );
}
