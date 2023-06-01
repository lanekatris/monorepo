import { Goal, GoalFrequency, useGetGoalsQuery } from "../gql/generated";
import {
  Alert,
  Box,
  Chip,
  ListItem,
  ListItemText,
  Skeleton,
} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import React from "react";
import { graphql } from "gatsby";

interface GoalListProps {
  selectedGoalId: string | undefined;
  setSelectedGoalId: (newId: string) => void;
  goals: Goal[];
}

export function GoalList({
  selectedGoalId,
  setSelectedGoalId,
  goals = [],
}: GoalListProps) {
  return (
    <>
      {goals.map((goal) => (
        <Alert
          sx={{ mb: 1 }}
          severity={selectedGoalId === goal.id ? "success" : "info"}
          key={goal.id}
          onClick={() => setSelectedGoalId(goal.id)}
        >
          {goal.frequency}: {goal.name}{" "}
          {goal.frequency === GoalFrequency.Weekly && (
            <>({goal.targetCount}/wk)</>
          )}
          <Box>
            {goal.tags?.map((tag) => (
              <Chip key={tag} variant="outlined" size="small" label={tag} />
            ))}
          </Box>
        </Alert>
      ))}
    </>
  );
}
