import { Alert, Snackbar } from "@mui/material"

const AlertModal = ({open, duration, type, msg, onClose}) => {
  return (
    <Snackbar anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }} open={open} autoHideDuration={duration || 2000} onClose={onClose}>
      <Alert severity={type || 'info'}>{msg || '提示'}</Alert>
    </Snackbar>
  )
}

export default AlertModal