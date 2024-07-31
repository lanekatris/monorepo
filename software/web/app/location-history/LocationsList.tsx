import {
  Box,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Typography,
} from '@mui/joy';
import { LocationCustom } from './page';

export default function LocationsList({
  locations,
}: {
  locations: LocationCustom[];
}) {
  return (
    <List>
      {locations.map(({ Address, Name }) => (
        <Box key={Address + Name}>
          <ListItem>
            <ListItemContent>
              <Typography level="title-sm">
                <b>{Name || 'n/a'}</b>
              </Typography>
              <Typography level="body-sm">{Address}</Typography>
            </ListItemContent>
          </ListItem>
          <ListDivider />
        </Box>
      ))}
    </List>
  );
}
