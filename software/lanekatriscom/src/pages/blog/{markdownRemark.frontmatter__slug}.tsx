import * as React from "react";
import { graphql } from "gatsby";
import { Layout } from "../discs";
import {
  Alert,
  Box,
  Container,
  Divider,
  List,
  ListItem,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "gatsby";
import styled from "styled-components";
import RehypeReact from "rehype-react";
import { useState } from "react";
// export const Content = styled.div`
//   display: flex;
//   flex: 1;
//   margin-top: 2em;
//   max-width: 100vw;
//   overflow: hidden;
//   word-wrap: break-word;
//   div {
//     max-width: 100%;
//   }
// `;
// export const Heading = styled.h1`
//   font-size: 2em;
// `;
// export const List = styled.ul`
//   list-style-type: disc;
// `;
// export const Paragraph = styled.p`
//   font-size: 1.2em;
//   line-height: 1.5;
// `;
// export const SubHeading = styled.h2`
//   font-size: 1.5em;
// `;
// export const Title = styled.h1`
//   font-size: 3em;
//   text-align: center;
// `;

function BigImageViewer({ src, alt }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img src={src} alt={alt} />
      <Modal open={open} onClose={() => setOpen(!open)}>
        <Box>
          <img src={src} alt={alt} />
        </Box>
      </Modal>
    </>
  );
}

// const TypographyTwo = <Typography variant="h1" />;
// https://medium.com/swlh/how-to-create-blog-posts-from-markdown-with-gatsby-in-2021-80636d6ca8e9
export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html, htmlAst } = markdownRemark;
  const renderAst = new (RehypeReact as any)({
    components: {
      h1: ({ children }) => (
        <Typography variant="h1" sx={{ pb: 2 }} style={{ fontSize: "2rem" }}>
          {children}
        </Typography>
      ),
      h3: ({ children }) => (
        <Typography variant="h3" sx={{ pb: 2 }} style={{ fontSize: "1.5rem" }}>
          {children}
        </Typography>
      ),
      // h2: SubHeading,
      p: ({ children }) => (
        <Typography variant="body1" gutterBottom sx={{ pb: 1 }}>
          {children}
        </Typography>
      ),
      ul: ({ children }) => <List>{children}</List>,
      li: ({ children }) => <ListItem>{children}</ListItem>,
      br: ({ children }) => <div style={{ height: 30 }}></div>,
      // strong: ({children}) => <Typography >{children}</Typography>
      blockquote: ({ children }) => (
        <Alert severity="info" sx={{ mb: 3 }}>
          {children}
        </Alert>
      ),
      // img: ({ src, alt }) => <BigImageViewer src={src} alt={alt} />,
      // img: ({ children, ...rest }) => {
      //   console.log(children, rest);
      //   return children;
      // },
    },
    createElement: React.createElement,
  }).Compiler;
  return (
    <Layout>
      <Container maxWidth="md">
        <Box
          sx={{ p: 3 }}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Link to="/" style={{ display: "flex" }}>
            Home
          </Link>
          <Link to="/blog" style={{ display: "flex" }}>
            Blog
          </Link>
        </Box>
        <Box sx={{ pb: 2 }}>
          <Typography variant="h4" color="secondary">
            {frontmatter.title}
          </Typography>
          <Typography variant="subtitle1">{frontmatter.date}</Typography>
          {/*<Divider />*/}
        </Box>
        <Box component="article">
          {/*<div dangerouslySetInnerHTML={{ __html: html }} />*/}
          {renderAst(htmlAst)}
        </Box>
      </Container>
    </Layout>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      htmlAst
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`;
