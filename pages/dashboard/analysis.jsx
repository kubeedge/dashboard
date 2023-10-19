import AnalysisIntroduce from '@/components/Pages/dashboard/AnalysisIntroduce'
import { Grid, Typography } from '@mui/material'

const Analysis = () => {
  return (
    <>
      <Grid container spacing={4} sx={{ padding: '60px 24px 24px 24px', backgroundColor: 'rgb(28, 70, 136)' }}>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography
            as='h1'
            sx={{
              fontWeight: '500',
              fontSize: '24px',
              color: '#fff'
            }}
          >
            名称空间
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <AnalysisIntroduce />
        </Grid>
      </Grid>
    </>
  )
}

export default Analysis