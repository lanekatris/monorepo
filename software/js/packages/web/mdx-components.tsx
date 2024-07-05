import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
// import * as console from "node:console";
export function useMDXComponents(components: MDXComponents): MDXComponents {
  console.log(components);
  return {
    ...components,
    // Image: (props) => <Image {...props} />,
    // img: (props) => <Image {...props} />,
  };
}
