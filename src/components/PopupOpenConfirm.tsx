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
const PopupOpenConfirm = ({ ...props }: PopupProps) => {

    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
                ID:1 - Confirm Pyament
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
                
                <div>Amount: 100 LUNES</div>
                <div>Price Uni: 0.03 USDT</div>
                <div>Total: 3.00 USDT</div>
                <br/>
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Attention</div>
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Your Confirm Pyament</div>
                <div style={{textAlign:"center",fontSize:18, fontWeight:"bold"}}>Amount: 100 LUNES</div>
                <br/>
                <div style={{color:"red"}}>Date expire to deposit: 12/01/2023 10:19</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button autoFocus color='primary' variant="contained" onClick={props.handleClose}>
                    Confirm
                </Button>
            </DialogActions>
        </div>

    )
}
export default PopupOpenConfirm