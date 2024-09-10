import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

export interface StatusData {
  label?: string;
  value?: string;
  color?: string;
  dotColor?: string;
}

interface StatusCardProps {
  title?: string;
  statusData?: StatusData[];
}

export const StatusCard = (props: StatusCardProps) => {
  const itemXs = 12 / (props?.statusData?.length || 1);
  return (
    <Card sx={{
      boxShadow: 'none', // Remove the card shadow
    }}>
      {/* Title Section */}
      <Box sx={{
        backgroundColor: '#f5f5f5', // Background color
        padding: '6px', // Padding
      }}>
        <Typography variant="h6" component="div">
          {props?.title}
        </Typography>
      </Box>

      {/* Content Section */}
      <CardContent>
        <Grid container spacing={2}>
          {props?.statusData?.map((data: StatusData, index: number) => (
            <Grid item xs={itemXs} key={index}>
              <Typography
                // TODO: remove it
                // @ts-ignore
                variant="h7"
                align="center"
                sx={{ width: index === 3 ? '30px' : '10px' }} // Set width
              >
                {data.value}
              </Typography>
              <Typography
                // TODO: remove it
                // @ts-ignore
                variant="body3"
                align="center"
                sx={{ display: 'flex', alignItems: 'center', color: data.color }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: data.dotColor,
                    marginRight: 1
                  }}
                />
                {data.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
