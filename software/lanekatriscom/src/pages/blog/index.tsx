import React from "react";
import { graphql } from "gatsby";
import { Layout } from "../discs";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import pluralize from "pluralize";
import { Link } from "gatsby";
import { navigate } from "gatsby";

export default function BlogListPage({ data }) {
  console.log("data", data);
  return (
    <Layout>
      <Container maxWidth="xs">
        <Box p={3}>
          <Link to="/" style={{ textAlign: "center", display: "block" }}>
            Home
          </Link>
          <Typography align="center" variant="h4">
            Blog Posts
          </Typography>
        </Box>
        <Typography>
          {data.groupQuery.group[1].totalCount} Published Articles
        </Typography>
        <Typography>
          {data.groupQuery.group[0].totalCount} Draft Articles
        </Typography>
        <List>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <ListItem
              // button
              key={node.id}
              component={Link}
              to={`/blog/${node.frontmatter.slug}`}
              // onClick={() => navigate(`/blog/${node.frontmatter.slug}`)}
            >
              <ListItemText
                primary={node.frontmatter.title}
                secondary={`${node.frontmatter.date} | ${node.wordCount.words} words | ${node.timeToRead} min to read`}
              ></ListItemText>
              {/*{node.frontmatter.date} - {node.frontmatter.title} - {node.excerpt}*/}
            </ListItem>
          ))}
        </List>
      </Container>
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    groupQuery: allMarkdownRemark {
      group(field: { frontmatter: { published: SELECT } }) {
        totalCount
        field
      }
    }
    allMarkdownRemark(filter: { frontmatter: { published: { eq: true } } }) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
            date(formatString: "YYYY-MM-DD")
          }
          excerpt(truncate: true, pruneLength: 80)
          wordCount {
            words
          }
          timeToRead
        }
      }
    }
  }
`;
