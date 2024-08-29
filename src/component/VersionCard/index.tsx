import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import getConfig from 'next/config';

interface VersionCardProps {
  title?: string;
  statusData?: {
    label: string;
    value: string;
    color: string;
    dotColor: string;
  }[];
}

export const VersionCard = ({title, statusData}: VersionCardProps) => {
  return (
    <Card sx={{ boxShadow: 'none',height: '125px' }}>
      {/* Title Section */}
      <Box sx={{
        backgroundColor: '#f5f5f5', // Background color
        padding: '6px', // Padding
      }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>

      {/* Content Section */}
      <CardContent>
        <Grid container spacing={2}>
          {/* Right Side */}
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {statusData?.map((data, index) => (
              <Typography
                key={index}
              // TODO: remove it
              // @ts-ignore
              variant="body3" align="left">
              <strong>{data.label}</strong> {data.value}
            </Typography>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
