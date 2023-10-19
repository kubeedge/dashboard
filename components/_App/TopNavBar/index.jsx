import { AppBar, Toolbar, Tooltip, IconButton, Typography, Stack } from '@mui/material'
import CurrentDate from './CurrentDate'
import NamespaceSelect from './NamespaceSelect'

const TopNavbar = ({ toogleActive }) => {
  return (
    <>
      <AppBar
        color="inherit"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "0px 4px 20px rgba(47, 143, 232, 0.07)",
          py: "6px",
          position: "sticky",
        }}
        className="top-navbar-for-dark"
      >
        <Toolbar >
          <Tooltip title="显示/隐藏" arrow>
            <IconButton
              size="sm"
              edge="start"
              color="inherit"
              onClick={toogleActive}
            >
              <i className="ri-align-left"></i>
            </IconButton>
          </Tooltip>


          <NamespaceSelect/>
          <Typography component="div" sx={{ flexGrow: 1 }}></Typography>

          <Stack sx={{float: 'right'}} direction="row" spacing={2}>
            <CurrentDate />
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default TopNavbar