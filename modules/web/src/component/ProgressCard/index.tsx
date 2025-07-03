import { Box, Card, CardHeader, CardContent, Typography } from '@mui/material';
import { ProgressRing, type ProgressRingProps } from '@/component/ProgressRing'

interface ProgressCardProps {
  title?: string;
  progressData?: ProgressRingProps[];
}

export const ProgressCard = (props: ProgressCardProps) => (
  <Card
    sx={{
      width: '100%',
      margin: 0,
      boxShadow: 'none', // Remove the card shadow
      borderRadius: '8px', // Optional: Adjust border radius if needed
    }}
  >
    <CardHeader
      sx={{
        backgroundColor: '#f5f5f5',
        padding: 2,
        marginBottom: 1,
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '24px',
        lineHeight: '20px',
        fontWeight: 'bold',
        overflow: 'hidden',
      }}
      // TODO: remove it
      // @ts-ignore
      title={<Typography variant="h7">{props?.title}</Typography>}
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
