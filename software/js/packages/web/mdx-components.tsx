import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Image: (props) => <Image {...props} />,
    // img: (props) => <Image {...props} />,
  };
}
