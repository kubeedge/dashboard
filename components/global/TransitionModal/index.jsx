import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};

const TransitionsModal = ({ open, option, handleClose }) => {

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        disableEscapeKeyDown
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
              <option.icon fontSize="large" sx={{ marginRight: 1, color: option.color || '#000' }} />{option.title}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2, textIndent: 20 }}>
              {option.desc}
            </Typography>
            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => handleClose(false)}>取消</Button>
              <Button variant="contained" onClick={() => option.onOk()}>确定</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export default TransitionsModal