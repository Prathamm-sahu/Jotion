"use client";

import type { document } from "@/types/document";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Item, { ItemSkeleton } from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { Session } from "next-auth";

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
}

const DocumentList: FC<DocumentListProps> = ({
  parentDocumentId,
  level = 0,
}) => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId], // Using square brackets to put the value of documentId
    }));
  };

  const { data: documents, isLoading } = useQuery({
    queryKey: ["document", parentDocumentId],
    queryFn: async () => {
      let doc;
      if (!!parentDocumentId && parentDocumentId !== null) {
        doc = await axios.get(
          `/api/document/getDocument/getByParentId/${parentDocumentId}`
        );
      } else if (
        (parentDocumentId === null || parentDocumentId === undefined) &&
        level === 0
      ) {
        doc = await axios.get("/api/document/getDocument");
      }
      if (doc === undefined) {
        return [] as document[];
      }
      return doc?.data as document[];
    },
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <ItemSkeleton level={level} />
        {level === 0 && (
          <>
            <ItemSkeleton level={level} />
            <ItemSkeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {documents.length === 0 && (
        <p
          style={{
            paddingLeft: level ? `${level * 12 + 25}px` : undefined,
          }}
          className={cn(
            "hidden text-sm font-medium text-muted-foreground/80",
            expanded && "last:block",
            level === 0 && "hidden"
          )}
        >
          No pages inside
        </p>
      )}
      {documents !== undefined &&
        documents.map((doc: document) => (
          <div key={doc.id}>
            <Item
              id={doc.id}
              onClick={() => {
                onRedirect(doc.id);
                queryClient.invalidateQueries([
                  "getDocument",
                  "getById",
                  doc.id,
                ]);
              }}
              label={doc.title}
              icon={FileIcon}
              documentIcon={doc.icon || ""}
              parentDocumentId={parentDocumentId}
              active={params.documentId === doc.id}
              level={level}
              onExpand={() => onExpand(doc.id)}
              expanded={expanded[doc.id]}
            />
            {!!expanded[doc.id] && (
              <DocumentList
                parentDocumentId={doc.id}
                level={level + 1}
              />
            )}
          </div>
        ))}
    </>
  );
};

export default DocumentList;


{
  /* 
  This will work if there is further no nested document. There can no nested document in parent or there can also be no nested document in children.
  Case 1:
  GrandParent
    Parent
      child
        No pages inside

  Case 2:
  Parent
    No pages inside

*/
}