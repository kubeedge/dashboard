import { Box, CircularProgress, Typography } from '@mui/material';
import tinycolor from 'tinycolor2';

export interface ProgressRingProps {
  value: number;
  total: number | string;
  color: string;
}

export const ProgressRing = (props: ProgressRingProps) => {
  // Generate a lighter color for the background ring
  const backgroundColor = tinycolor(props?.color).lighten(30).toString();

  return (
    <Box position="relative" display="flex" flexDirection="column" alignItems="center" margin={1}>
      {/* Background ring */}
      <CircularProgress
        variant="determinate"
        value={100} // Full progress to act as background
        size={80}
        thickness={4}
        sx={{
          color: backgroundColor, // Light color for background ring
          position: 'absolute',
          zIndex: 1,
        }}
      />
      {/* Foreground progress */}
      <CircularProgress
        variant="determinate"
        value={props?.value}
        size={80}
        thickness={4}
        sx={{
          color: props?.color, // Main color for progress
          position: 'relative',
          zIndex: 2,
        }}
      />
      <Typography variant="caption" color="textSecondary" marginTop={1}>
        {props?.value}% - {props?.total}
      </Typography>
    </Box>
  );
};
