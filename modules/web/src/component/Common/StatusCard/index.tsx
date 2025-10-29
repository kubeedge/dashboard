import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const itemXs = 12 / (props?.statusData?.length || 1);

  return (
    <Card
      sx={{
        boxShadow: 'none',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      }}
    >
      {/* Title Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
          padding: '6px',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
        >
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
                sx={{
                  width: index === 3 ? '30px' : '10px',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                {data.value}
              </Typography>
              <Typography
                // TODO: remove it
                // @ts-ignore
                variant="body3"
                align="center"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: data.color || (theme.palette.mode === 'dark' ? '#fff' : '#000'),
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: data.dotColor,
                    marginRight: 1,
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
