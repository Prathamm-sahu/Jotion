"use client";

import { useState } from "react";
import { Check, Copy, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { document } from "@/types/document";
import axios from "axios";
import { Button } from "../ui/Button";

interface PublishProps {
  initialData: document;
}

export function Publish({ initialData }: PublishProps) {
  const origin = useOrigin();
  const queryClient = useQueryClient()
  const { mutate: updateContent } = useMutation({
    mutationFn: async (isPublished: boolean) => {
      const payload = {
        id: initialData.id,
        isPublished,
      };
      const { data } = await axios.patch("/api/document/update", payload);
      
      return data as document;
    },
    onError: () => {
      toast.error("Error occured");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["document", initialData?.parentDocumentId]);
      queryClient.invalidateQueries([
        "getDocument",
        "getById",
        initialData.id,
      ]);
    },
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData.id}`;

  const onPublish = async () => {
    try {
      setIsSubmitting(true);
      updateContent(true);
      toast.success("Note published!")
    } catch (error) {
      toast.error("Error to publish note.")
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUnPublish = () => {
    try {
      setIsSubmitting(true);
      updateContent(false);
      toast.success("Note Unpublished!")
    } catch (error) {
      toast.error("Error to publish note.")
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex gap-x-2 items-center">
              <Globe className="text-sky-500 animate-pulse w-4 h-4" />
              <p className="text-xs font-medium text-sky-500">
                This note live on web
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                className="h-8 rounded-l-none"
                onClick={onCopy}
                disabled={copied}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              className="w-full text-xs"
              size="sm"
              disabled={isSubmitting}
              onClick={onUnPublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Globe className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              className="w-full text-xs"
              size="sm"
              disabled={isSubmitting}
              onClick={onPublish}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
