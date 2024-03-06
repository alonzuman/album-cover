"use client";
import React from "react";
import { ListCovers, createCover, listCovers } from "./action";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function Covers(props: { data: ListCovers }) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const { toast } = useToast();
  const covers = props.data;

  const cover1 = covers.find((album) => album.id === selected[0]);
  const cover2 = covers.find((album) => album.id === selected[1]);

  const { push } = useRouter();

  return (
    <form
      action={async (formData) => {
        const res = await createCover(formData);
        push(`/cover/${res.id}`);
      }}
    >
      {cover1 && <input type="hidden" name="cover1" value={cover1.id} />}
      {cover2 && <input type="hidden" name="cover2" value={cover2.id} />}
      <div className="grid grid-cols-2 gap-2">
        {covers.map((album) => {
          const isSelected = selected.includes(album.id);

          return (
            <button
              type="button"
              onClick={() => {
                setSelected((prev) => {
                  const selectedMoreThanTwo = prev.length > 1;

                  if (!isSelected && selectedMoreThanTwo) {
                    toast({
                      title: "Maximum selection reached",
                      description: "You can only select two images.",
                      variant: "destructive",
                    });
                    return prev;
                  }
                  if (isSelected) return prev.filter((id) => id !== album.id);
                  return [...prev, album.id];
                });
              }}
              key={album.id}
              className={cn(
                "transition-all duration-100 h-full w-full flex items-center justify-center",
                isSelected ? "scale-95" : "scale-100"
              )}
            >
              <Image
                height={512}
                width={512}
                src={album.url}
                alt={album.id}
                className="object-cover h-full w-full rounded-md"
              />
            </button>
          );
        })}
      </div>
      <footer
        className={cn(
          selected?.length > 0 ? "translate-y-0" : "translate-y-44",
          "transition-all duration-100 flex justify-between fixed left-[50%] p-4 -translate-x-[50%] bottom-4 max-w-md mx-auto w-full z-10 bg-background border-border rounded-md"
        )}
      >
        <div className="flex gap-2">
          {cover1 && (
            <Image
              className="rounded object-cover h-12 w-12"
              height={48}
              width={48}
              src={cover1.url}
              alt={cover1.id}
            />
          )}
          {cover1 && cover2 && (
            <span className="flex flex-col items-center h-full w-full justify-center px-4 text-xl">
              +
            </span>
          )}
          {cover2 && (
            <Image
              className="rounded object-cover h-12 w-12"
              height={48}
              width={48}
              src={cover2.url}
              alt={cover2.id}
            />
          )}
        </div>
        <SubmitButton />
      </footer>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button size="lg" type="submit">
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}
