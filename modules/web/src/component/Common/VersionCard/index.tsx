import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface VersionCardProps {
  title?: string;
  statusData?: {
    label: string;
    value: string;
    color: string;
    dotColor: string;
  }[];
}

export const VersionCard = ({ title, statusData }: VersionCardProps) => {
  const theme = useTheme();
  const itemXs = 12 / (statusData?.length || 1);

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
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>

      {/* Content Section */}
      <CardContent
        sx={{
          backgroundColor: 'transparent !important',
        }}
      >
        <Grid container spacing={2}>
          {statusData?.map((data, index) => (
            <Grid item xs={itemXs} key={index}>
              <Typography

                // @ts-ignore
                variant="h7"
                align="center"
                sx={{
                  visibility: 'hidden',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  width: index === 3 ? '30px' : '10px',
                }}
              >
                {data.value || '0'}
              </Typography>
              <Typography
                // @ts-ignore
                variant="body3"
                align="center"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: data.color || (theme.palette.mode === 'dark' ? '#fff' : '#000'),
                  lineHeight: 1.1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    marginRight: 1,
                  }}
                />
                {data.label} {data.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
