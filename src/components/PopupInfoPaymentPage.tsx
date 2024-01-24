import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type PopupProps = {
    handleClose: any,
}
const PopupInfoPaymentPage = ({ ...props }: PopupProps) => {

    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
                My P2P LUNES
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={props.handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <div style={{textAlign:"center"}}>Payment information</div>
                
                <img src={`img/qr.png`} style={{ width: "250px", margin:"auto" }}  />
                <div>0xCc5Bd4a09FD013D80Ff17f0152f174e40B9bcf33 
                <Button autoFocus color='primary' variant="text">
                    Copy
                </Button>
                </div>
                <div>Amount: 100 LUNES</div>
                <div>Price Uni: 0.03 USDT</div>
                <div>Total: 3.00 USDT</div>
                <div style={{color:"red"}}>Date expire to deposit: 12/01/2023 10:19</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
              
            </DialogActions>
        </div>

    )
}
export default PopupInfoPaymentPage