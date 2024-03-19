import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { convertAmountLunes, getPairLabel, getPairType, getTotalPayment } from '../utils/convert';

type PopupProps = {
    handleClose: any,
    handleConfirm: any,
    order:any,   
    feeNetWork:any,
    info: any,
}
const PopupOpenCancel = ({ ...props }: PopupProps) => {
    const [total, setTotal] = React.useState("0")
    React.useEffect(() => {
        const t = (convertAmountLunes(props.order.value) * Number(props.info.feeP2p)) / 100
        setTotal(t.toString())        
    }, [])
   
    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
                ID:{props.order.id}- Cancel trade
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
                <div>Price Uni: {convertAmountLunes(props.order.price)}  {getPairLabel(props.order.pair)}</div>
                <div style={{fontSize:18, fontWeight:"bold"}} >Total:  {getTotalPayment(props.order.price,props.order.value, props.order.pair)}  {getPairType(props.order.pair)}</div>
                <div>Fee OTC: {props.info.feeP2p}%</div>
                <br/>
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Attention</div>
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Negotiations not completed result in a fine</div>
                
                <div style={{textAlign:"center",fontSize:18, fontWeight:"bold"}}>You must pay</div>
                <div style={{textAlign:"center",fontSize:18, fontWeight:"bold"}}>Amount: {total} LUNES</div>
                <br/>
                <div style={{color:"red"}}>Date expire to deposit: 12/01/2023 10:19</div>
            </DialogContent>
            <DialogActions>
                 <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: {props.feeNetWork} LUNES </div>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button autoFocus color='primary' variant="contained" onClick={()=>{props.handleConfirm(props.order.id,total);props.handleClose()}}>
                    Confirm
                </Button>
            </DialogActions>
        </div>

    )
}
export default PopupOpenCancel