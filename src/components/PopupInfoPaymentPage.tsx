import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { convertAmountLunes, convertTimestamp, getPairLabel, getPairType, getTotalPayment } from '../utils/convert';
import Timestamp from 'react-timestamp';
import QRCode from 'react-qr-code';

type PopupProps = {
    handleClose: any,
    order:any
}
const PopupInfoPaymentPage = ({ ...props }: PopupProps) => {
   
    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
               ID {props.order.id} - My P2P LUNES
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
                <div style={{textAlign:"center", fontSize:20}}>Payment information</div>    
                <div  style={{ width: "250px", margin:"auto" }}>
                    <QRCode value={props.order.btcAddress?props.order.btcAddress:props.order.erc20Address} />
                </div>            
                
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold", margin:15}}>{props.order.btcAddress?props.order.btcAddress:props.order.erc20Address}
                {/**
                 <Button autoFocus color='primary' variant="text">
                    Copy
                </Button>
                 */}
                </div>
                <div>Amount: {convertAmountLunes(props.order.value)} LUNES</div>
                <div>Price Uni: {convertAmountLunes(props.order.price)}  {getPairLabel(props.order.pair)}</div>
                <div style={{fontSize:18, fontWeight:"bold"}} >Total:  {getTotalPayment(props.order.price,props.order.value)}  {getPairType(props.order.pair)} to payment</div>
                <br/>
                <div style={{background:"#DAE2ED"}}>{props.order.infoPayment}</div>
                <br/>
                <div style={{color:"red"}}>Date expire to deposit: <Timestamp date={convertTimestamp(props.order.dateExpire)} /></div>
                <div style={{ color: "red" }}>Attention: Negotiations not completed result in a fine, confirm?</div>
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