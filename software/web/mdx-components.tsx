import type { MDXComponents } from 'mdx/types';
// import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import Image from 'next/image';
// import * as console from "node:console";
import { Code } from 'bright';
// SyntaxHighlighter.registerLanguage('sql', sql);
Code.theme = 'light-plus';
export function useMDXComponents(components: MDXComponents): MDXComponents {
  console.log(components);
  return {
    ...components,
    pre: Code,
    // Image: (props) => <Image {...props} />,
    // img: (props) => <Image {...props} />,
  };
}
