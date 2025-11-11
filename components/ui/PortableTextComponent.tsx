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
