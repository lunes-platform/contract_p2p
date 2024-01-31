import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { convertAmountLunes, convertTimestamp, getPairLabel, getPairType, getTotalPayment } from '../utils/convert';
import Timestamp from 'react-timestamp';

type PopupProps = {
    handleClose: any,
    handleConfirm: any,
    order:any,
    feeNetWork:any
}
const PopupConflitApprovPaymentPage = ({ ...props }: PopupProps) => {
    React.useEffect(()=>{
        console.log("veio", props.order)
    },[])
    const getTotal = () =>{
        let price_ = convertAmountLunes(props.order.price)
        let amount_ = convertAmountLunes(props.order.value)
        let tt = price_ * amount_
        
        return tt || 0
    }
    const confirm = (isConfirm: boolean) =>{
        props.handleConfirm(props.order.id, isConfirm)
        props.handleClose()
    }
    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
               ID {props.order.id} - Conflit payment
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
                     
                
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold", margin:15}}>{props.order.btcAddress?props.order.btcAddress:props.order.erc20Address}</div>
                <div>Amount: {convertAmountLunes(props.order.value)} LUNES</div>
                <div>Price Uni: {convertAmountLunes(props.order.price)}  {getPairLabel(props.order.pair)}</div>
                <div style={{fontSize:18, fontWeight:"bold"}} >Total:  {getTotalPayment(props.order.price,props.order.value)}  {getPairType(props.order.pair)}</div>
                <br/>
                <div style={{background:"#DAE2ED"}}>{props.order.info_payment}</div>
                <br/>
                <div style={{color:"red"}}>Date expire to deposit: <Timestamp date={convertTimestamp(props.order.dateExpire)} /></div>
            </DialogContent>
            <DialogActions>
                <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: {props.feeNetWork} LUNES </div>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button autoFocus color='secondary' variant="contained" onClick={()=>confirm(false)}>
                    NO
                </Button>
                <Button autoFocus color='primary' variant="contained" onClick={()=>confirm(true)}>
                    YES 
                </Button>
              
            </DialogActions>
        </div>

    )
}
export default PopupConflitApprovPaymentPage