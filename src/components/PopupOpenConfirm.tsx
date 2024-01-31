import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Timestamp from 'react-timestamp';
import { convertAmountLunes, convertTimestamp, getTotalPayment } from '../utils/convert';

type PopupProps = {
    handleClose: any,
    handleConfirm: any,
    order:any,   
    feeNetWork:any
}
const PopupOpenConfirm = ({ ...props }: PopupProps) => {

    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
                ID:{props.order.id} - Confirm Pyament
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
                
                <div>Amount: {convertAmountLunes(props.order.value)} LUNES</div>
                <div>Price Uni: {convertAmountLunes(props.order.price)}  {props.order.pair}</div>
                <div>Total: {getTotalPayment(props.order.price,props.order.value)}  {props.order.pair}</div>
                <br/>
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Attention</div>
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Your Confirm Pyament</div>
                <div style={{textAlign:"center",fontSize:18, fontWeight:"bold"}}>Amount:  {convertAmountLunes(props.order.value)} LUNES</div>
                <br/>
                <div style={{color:"red"}}>Date expire to deposit: <Timestamp date={convertTimestamp(props.order.dateExpire)} /></div>
            </DialogContent>
            <DialogActions>
                <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: {props.feeNetWork} LUNES </div>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button autoFocus color='primary' variant="contained" onClick={()=>{props.handleConfirm(props.order.id, props.order.email,props.order.value);props.handleClose()}}>
                    Confirm
                </Button>
            </DialogActions>
        </div>

    )
}
export default PopupOpenConfirm