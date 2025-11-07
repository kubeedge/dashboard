import { Box, Card, CardHeader, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ProgressRing, type ProgressRingProps } from '@/component/Common/ProgressRing';

interface ProgressCardProps {
  title?: string;
  progressData?: ProgressRingProps[];
}

export const ProgressCard = (props: ProgressCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: '100%',
        margin: 0,
        boxShadow: 'none',
        borderRadius: '8px',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      }}
    >
      <CardHeader
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
          padding: 2,
          marginBottom: 1,
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '24px',
          lineHeight: '20px',
          fontWeight: 'bold',
          overflow: 'hidden',
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        }}
        // @ts-ignore
        title={<Typography variant="h6">{props?.title}</Typography>}
      />
      <CardContent>
        <Box display="flex" flexDirection="row" justifyContent="space-around">
          {props?.progressData?.map((data: ProgressRingProps, index: number) => (
            <ProgressRing key={index} value={data.value} total={data.total} color={data.color} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
