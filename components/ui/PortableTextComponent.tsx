/**
 * Portable Text components configuration for rendering custom content blocks.
 *
 * @remarks
 * This configuration defines custom renderers for Portable Text content types,
 * specifically handling image blocks with Next.js Image optimization.
 *
 * @property types.image - Custom renderer for image blocks that uses Next.js Image component
 * with Sanity image optimization. Images are rendered with fixed dimensions (800x450),
 * 90% quality, automatic format selection, rounded corners, and left alignment with margin.
 *
 * @returns {PortableTextComponents} Configuration object for PortableText component
 *
 * @example
 * ```tsx
 * <PortableText value={content} components={components} />
 * ```
 */
import Image from "next/image";
import { PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

export const components: PortableTextComponents = {
  types: {
    image: (props) =>
      props.value ? (
        <Image
          className="max-w-1/3  align-start m-4 rounded-lg "
          src={urlFor(props.value).width(800).height(450).quality(90).auto("format").url()}
          alt={props?.value?.alt || ""}
          width="800"
          height="450"
        />
      ) : null,
  },
};
