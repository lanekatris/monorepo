import React from "react";
import { DiscDto, DiscDtoType, useGetDiscsQuery } from "../gql/generated";
import {
  Chip,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { Link } from "gatsby-theme-material-ui";
import AddDisc from "./add-disc";

const brandMap = {
  "Dynamic Discs": "DD",
};

function DiscListItem({ disc }: { disc: DiscDto }) {
  const secondaryData = [
    disc.created,
    disc.discType === DiscDtoType.Mini ? (
      <Chip label={disc.discType} size="small" variant="outlined" />
    ) : null,
    disc.weight,
    disc.color,
  ];

  return (
    <ListItem
      key={disc.id}
      secondaryAction={
        <Link to={`/disc/${disc.id}`}>
          <IconButton edge="end">
            <EditIcon />
          </IconButton>
        </Link>
      }
    >
      <ListItemText
        primary={
          <>
            {disc.number} - {brandMap[disc.brand] || disc.brand} {disc.model}
          </>
        }
        secondary={secondaryData
          .filter((x) => x)
          .map((x, i) => (
            <span key={i}>
              {i !== 0 && " | "} {x}
            </span>
          ))}
      />
    </ListItem>
  );
}

export default function DiscList() {
  const { data, loading, error } = useGetDiscsQuery({
    fetchPolicy: "network-only",
  });
  console.log("d", data);

  if (error) return <div>{JSON.stringify(error)}</div>;
  if (loading)
    return (
      <List>
        {new Array(20).fill(undefined).map((x, i) => (
          <ListItem key={i} sx={{ height: 72 }}>
            <Skeleton variant="rectangular" height={30} width="100%" />
          </ListItem>
        ))}
      </List>
    );
  return (
    <>
      <List>
        {data?.discs.map((disc) => (
          <>
            <DiscListItem disc={disc} />
            <Divider />
          </>
        ))}
        <ListItem sx={{ height: 80 }}></ListItem>
      </List>
      <AddDisc />
    </>
  );
}
