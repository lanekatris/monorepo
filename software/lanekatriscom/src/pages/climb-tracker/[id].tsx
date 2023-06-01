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
import { Layout } from "../discs";
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

export default function ClimbSessionPage() {
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
            Climb: abc-123
          </Typography>
        </Box>
        {/*<Typography variant="subtitle2" align="center">*/}
        {/*  Your Sessions*/}
        {/*/!*</Typography>*!/*/}
        {/*<ClimbSessions />*/}
        {/*<List>*/}
        {/*  {GRADES.map((x) => (*/}
        {/*    <ListItem key={x}>*/}
        {/*      <ListItemText primary={x} />*/}
        {/*    </ListItem>*/}
        {/*  ))}*/}
        {/*</List>*/}
        {/*<Grid container>*/}
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
            // label="View Format (Normal/Simple)"
            label={`Viewing ${viewFormat}`}
          />
          {/*<FormControlLabel disabled control={<Switch />} label="Disabled" />*/}
        </FormGroup>
        {model.map(({ grade, attempts, climbs, color }) => (
          <Grid
            container
            // rowSpacing={7}
            spacing={0}
            // justifyContent="space-between"
            justifyContent="center"
            alignItems="center"
            key={grade}
          >
            {/*<Grid xs={12}>*/}
            {/*  <Typography>{grade}</Typography>*/}
            {/*</Grid>*/}
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
            {/*{viewFormat === "simple" && (*/}
            {/*  <Grid item xs={2}>*/}
            {/*    /!*<Typography sx={{ fontSize: "2em" }}>-</Typography>*!/*/}
            {/*  </Grid>*/}
            {/*)}*/}
            {viewFormat === "normal" && (
              <Grid item>
                <Typography sx={{ fontSize: "3em" }}>{climbs}</Typography>
              </Grid>
            )}
            {/*<Grid item xs={2}>*/}
            {/*  */}
            {/*</Grid>*/}
            <Grid item>
              <IconButton
                onClick={() => {
                  const c = [...model];
                  const find = c.find((x) => x.grade === grade);
                  // @ts-ignore
                  find.attempts++;
                  // find.climbs++;
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
            {/*<Divider />*/}
          </Grid>
        ))}
        {/*</Grid>*/}
      </Container>
    </Layout>
  );
}
