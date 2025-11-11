// components/PortableBody.tsx
import Image from "next/image";
import { PortableText, PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

export type BlockNode =
  | { _key: string; _type: "block"; [k: string]: any }
  | { _key: string; _type: "image"; asset: any; alt?: string; [k: string]: any };

function groupNodesIntoChunksOfImages(nodes: BlockNode[]) {
  const chunks: Array<
    { type: "images"; items: BlockNode[] } | { type: "blocks"; items: BlockNode[] }
  > = [];
  let i = 0;
  while (i < nodes.length) {
    // gather consecutive images
    if (nodes[i]._type === "image") {
      const imgs: BlockNode[] = [];
      while (i < nodes.length && nodes[i]._type === "image") {
        imgs.push(nodes[i]);
        i++;
      }
      chunks.push({ type: "images", items: imgs });
    } else {
      const blocks: BlockNode[] = [];
      while (i < nodes.length && nodes[i]._type !== "image") {
        blocks.push(nodes[i]);
        i++;
      }
      chunks.push({ type: "blocks", items: blocks });
    }
  }
  return chunks;
}

const SingleImage = ({ value }: any) => {
  if (!value) return null;
  const src = urlFor(value).width(1600).height(900).quality(85).auto("format").url();
  return (
    <figure className="not-prose my-6">
      <Image
        className="rounded-lg"
        src={src}
        alt={value.alt || ""}
        width={1600}
        height={900}
        sizes="(min-width: 1024px) 900px, 100vw"
      />
    </figure>
  );
};

const components: PortableTextComponents = {
  types: { image: SingleImage },
};

export default function PortableBody({ value }: { value: BlockNode[] }) {
  const chunks = groupNodesIntoChunksOfImages(value || []);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {chunks.map((chunk) =>
        chunk.type === "images" ? (
          <div
            key={chunk.items[0]._key}
            className={`not-prose my-6 grid gap-4 grid-cols-1 sm:grid-cols-2 ${
              chunk.items.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
            {chunk.items.map((img: any) => {
              const src = urlFor(img).width(1200).height(800).quality(85).auto("format").url();
              return (
                <figure key={img._key} className="relative aspect-3/2 overflow-hidden rounded-xl">
                  <Image
                    src={src}
                    alt={img.alt || ""}
                    fill
                    sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </figure>
              );
            })}
          </div>
        ) : (
          // render the non-image blocks with PortableText as usual
          <PortableText
            key={(chunk.items[0] as any)?._key}
            value={chunk.items as any}
            components={components}
          />
        )
      )}
    </div>
  );
}
