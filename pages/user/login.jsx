import { Box, Button, Container, CssBaseline, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { useRouter } from 'next/router';
import AlertModal from '@/components/global/AlertModal'

const formValue = {
  token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImhsbTB5V0JzTmhWMUtsalVqczRpdVRfUFVjYkRTYktHdHNfazZtOFg2X2cifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJjdXJsLXVzZXItdG9rZW4tdzU5aGYiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiY3VybC11c2VyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiZDRiNjM5ZGEtZDE1MS00NjFlLTk4N2MtZGNhMTM0ZGVkNzBjIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmN1cmwtdXNlciJ9.gXf4xGNKOTZ3auNwDWJodTMeSrLpT2w1KVKx1fgRRlUPCaCZUwqmVKkySXGj6O-skLdOM-z4VRJ3ORS1B-ODHLBpfHgEEc7VlzTTuhwnmKWfW7wZQk8IDHkc4trIRLgjqu7vHXFSCqD_QszyZiBuyuk2kXp7wyoNRk1nHFh5V8AVSJ5OxdJQZblylCqpTED7IkkEmxsMEdKo1atrkEiy8vUxG2NHmlY2e1TmXXo7r8lldroiShqDoHEdH12mlxL5FzDCahXe3DMtV915C4Q9AqjxGIUaeHRxRZAL04pjjhmVvLDc_GAQg2AxdyCdYyo26o8JQw8VqIUT1ApcCh3klA',
  captcha: ''
}

const Login = () => {
  const [loginForm, setLoginForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  const router = useRouter()

  const handleSubmit = async () => {
    // const resp = await fetch('/api/login', {
    //   method: 'post',
    //   body: JSON.stringify({
    //     username: 'admin',
    //     password: 'admin123',
    //     autoLogin: true
    //   })
    // })
    // const res = await resp.json()
    setAlertInfo({
      type: 'success',
      msg: '登陆成功'
    })
    setAlertOpen(true)
    setTimeout(() => {
      router.push('/edgeResource/nodes')
    }, 1000);
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Container component='main'>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: '400px'
            }}>
            <Typography component='h1' variant='h1' sx={{ fontSize: '33px', color: 'rgba(0, 0, 0, 0.85)' }}>KubeEdge Dashboard</Typography>
            <Typography component='h4' variant='h6' sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', margin: '20px 0' }}>基于KubeEdge研发的Dashboard</Typography>
            <Box component='form' noValidate sx={{ width: '100%' }}>
              <TextField
                required
                autoFocus
                label='token'
                fullWidth
                value={loginForm.token}
                onChange={(e) => setLoginForm({ ...loginForm, token: e.target.value })}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, color: "#fff !important" }}
                onClick={handleSubmit}
              >登录</Button>
            </Box>
          </Box>
        </Container>
        <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
      </div>
    </div>
  )
}

export default Login