import { Box, Button, Card, CardContent } from "@mui/material"

const QueryContainer = ({ children, onReset, onQuery }) => {
  return (
    <Card sx={{mb: '10px', pt: '20px'}}>
      <CardContent>
        <Box sx={{my: '10px'}}>
          {children || '请插入内容'}
        </Box>
        <Box sx={{display: 'flex', justifyContent:'flex-end', mt: '20px'}}>
          <Button size="small" variant="outlined" onClick={() => onReset && onReset()}>重置</Button>
          <Button size="small" variant="contained" sx={{ml: '10px'}} onClick={() => onQuery && onQuery()}>查询</Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default QueryContainer