import { Box, Button, Card, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types'

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};


const DetailModal = ({ title, open, maxWidth, confirmText, handleClose, handleOk, onCancel, children }) => {

  return (
    <>
      <Dialog
        onClose={() => handleClose(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth={maxWidth || 'sm'}
        scroll="paper"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => handleClose(false)}>
          {title || '详情'}
        </BootstrapDialogTitle>
        <DialogContent>
          <Card sx={{
            boxShadow: "none",
            borderRadius: "10px",
            p: "25px",
            mb: "15px",
          }}>
            {children || '请插入内容'}
            <Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <Button size="small"
                  sx={{
                    mt: 2,
                    borderRadius: "4px",
                  }}
                  onClick={() => onCancel ? onCancel() : handleClose(false)}
                >关闭</Button>
                <Button size="small" variant="contained"
                  sx={{
                    mt: 2,
                    borderRadius: "4px",
                    color: "#fff !important"
                  }}
                  onClick={() => handleOk ? handleOk() : handleClose(false)}>
                  {confirmText || '确定'}
                </Button>
              </Box>
            </Box>
          </Card>
        </DialogContent>

      </Dialog>
    </>
  )
}

export default DetailModal