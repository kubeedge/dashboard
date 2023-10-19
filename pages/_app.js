import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/styles/theme'
import Layout from '@/components/_App/Layout'
import '@/styles/remixicon.css' // 图标
import '@/styles/globals.scss'

import { useRouter } from 'next/router'
import Login from './user/login.jsx'

export default function App({ Component, pageProps }) {

  const router = useRouter()
  let pageContent;
  if (router.pathname === '/') {
    pageContent = <Login />
  } else {
    pageContent = <Layout>
      <Component {...pageProps} />
    </Layout>
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {pageContent}
      </ThemeProvider>
    </>
  )
}
