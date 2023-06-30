import React, { useState } from "react";
import {
  Badge,
  Box,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ElderlyIcon from "@mui/icons-material/Elderly";
import { Link } from "gatsby";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ClimbSession} from "./index";
import {Layout} from "../layout";
const GRADES = [0, 1, 2, 3, 4, 5, 6, 7];

const gradeColor = {
  0: "success",
  1: "success",
  2: "success",
  3: "success",
  4: "warning",
  5: "warning",
  6: "error",
  7: "error",
};

export default function ClimbSessionPage({id}:{id:string}) {
  const queryClient = useQueryClient()
  const data = useQuery<ClimbSession | undefined>(['climb', id], x => queryClient.getQueryData<ClimbSession[]>(['climbs']).find(x => x.id === id))
  console.log('single',data)

  const [model, setModel] = useState(
    GRADES.map((grade) => ({
      grade: `V${grade}`,
      climbs: 0,
      attempts: 0,
      // @ts-ignore
      color: gradeColor[grade],
    }))
  );
  const [viewFormat, setViewFormat] = useState<"normal" | "simple">("simple");

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ paddingBottom: 10 }}>
        <Box p={3}>
          <Link
            to="/climb-tracker"
            style={{ textAlign: "center", display: "block" }}
          >
            Sessions
          </Link>
          <Typography align="center" variant="h4">
            Climb: {data?.data?.name}
          </Typography>
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={viewFormat === "simple"}
                onChange={(e) =>
                  setViewFormat(viewFormat === "simple" ? "normal" : "simple")
                }
              />
            }
            label={`Viewing ${viewFormat}`}
          />
        </FormGroup>
        {model.map(({ grade, attempts, climbs, color }) => (
          <Grid
            container
            spacing={0}
            justifyContent="center"
            alignItems="center"
            key={grade}
          >
            {viewFormat === "simple" && (
              <Grid item>
                <Chip variant="filled" label={grade} color={color} />
              </Grid>
            )}
            {viewFormat === "normal" && (
              <Grid item>
                <Typography sx={{ fontSize: "2em" }}>{grade}</Typography>
              </Grid>
            )}
            {viewFormat === "normal" && (
              <Grid item>
                <IconButton
                  onClick={() => {
                    const c = [...model];
                    const find = c.find((x) => x.grade === grade);
                    // @ts-ignore
                    find.climbs--;
                    // find.climbs++;
                    setModel(c);
                  }}
                >
                  <RemoveCircleOutlineIcon
                    color="error"
                    sx={{ fontSize: "3em" }}
                  />
                </IconButton>
              </Grid>
            )}
            {viewFormat === "normal" && (
              <Grid item>
                <Typography sx={{ fontSize: "3em" }}>{climbs}</Typography>
              </Grid>
            )}
            <Grid item>
              <IconButton
                onClick={() => {
                  const c = [...model];
                  const find = c.find((x) => x.grade === grade);
                  // @ts-ignore
                  find.attempts++;
                  setModel(c);
                }}
              >
                <Badge badgeContent={attempts} color="secondary">
                  <ElderlyIcon sx={{ fontSize: "3em" }} color="secondary" />
                </Badge>
              </IconButton>
              <IconButton
                onClick={() => {
                  const c = [...model];
                  const find = c.find((x) => x.grade === grade);
                  // @ts-ignore
                  find.climbs++;
                  setModel(c);
                }}
              >
                {viewFormat === "simple" && (
                  <>
                    <Badge badgeContent={climbs} color="primary">
                      <AddCircleOutlineIcon
                        sx={{ fontSize: "3em" }}
                        color="primary"
                      />
                    </Badge>
                  </>
                )}
                {viewFormat === "normal" && (
                  <AddCircleOutlineIcon
                    sx={{ fontSize: "3em" }}
                    color="primary"
                  />
                )}
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Container>
    </Layout>
  );
}
