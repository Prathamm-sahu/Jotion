"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { document } from "@/types/document";
import Toolbar from "@/components/Toolbar";
import { Cover, CoverSkeleton } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const queryClient = useQueryClient()
  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }),
    []
  );

  const { data: document } = useQuery({
    queryKey: ["getDocument", "publish", params.documentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/document/getDocument/publish/${params.documentId}`)
      return data as document
    }
  })

  const { mutate: updateContent } = useMutation({
    mutationFn: async (content: string) => {
      const payload = {
        id: params.documentId,
        content,
      }
      const { data } = await axios.patch('/api/document/update', payload)
      return data as document
    },
    onError: () => {
      toast.error("Error occured")
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["document", document?.parentDocumentId])
      queryClient.invalidateQueries(["getDocument", "getById", params.documentId])
    }
  })

  if (document === undefined) {
    return (
      <div>
        <CoverSkeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not Found</div>;
  }

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage || ""} />
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          updateContent={updateContent}
          initialContent={document.content}
        />
      </div>
    </div>
  );
}
