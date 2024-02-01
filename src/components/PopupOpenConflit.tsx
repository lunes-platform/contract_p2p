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
    handleUserConfirm: any,
    handleSallerConfirm: any,
    order:any,   
    feeNetWork:any,
    info: any,
    account:any
}
const PopupOpenConflit = ({ ...props }: PopupProps) => {
    const [total, setTotal] = React.useState("0")
    React.useEffect(() => {
        if(props.account.address==props.order.sellOwner){
            setTotal(""+convertAmountLunes(props.order.value))
        }else{
            const t = (convertAmountLunes(props.order.value) * Number(props.info.feeP2p)) / 100
            const tt = convertAmountLunes(props.order.value) - t
            setTotal(tt.toString())
        }
        
    }, [])
    const confirm = () =>{
        if(props.account.address==props.order.sellOwner){
            props.handleSallerConfirm(props.order.id, props.order.dateExpire, props.order.value);
        }else{
            props.handleUserConfirm(props.order.id, props.order.dateExpire, props.order.value);
        }
        props.handleClose()
    } 
    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
                ID:{props.order.id} - Open Conflit
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
                <div style={{fontSize:18, fontWeight:"bold"}} >Total:  {getTotalPayment(props.order.price,props.order.value)}  {getPairType(props.order.pair)}</div>
                <div>Fee OTC: {props.info.feeP2p}%</div>
                <br/>
                <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Attention</div>
                <div style={{textAlign:"center",fontSize:18, fontWeight:"bold"}}>Your Receivid case win</div>
                <div style={{textAlign:"center",fontSize:18, fontWeight:"bold"}}>Amount: {total} LUNES</div>
                <br/>
                <div style={{color:"red"}}>Date expire to deposit: <Timestamp date={convertTimestamp(props.order.dateExpire)} /></div>
            </DialogContent>
            <DialogActions>
                <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: {props.feeNetWork} LUNES </div>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button autoFocus color='primary' variant="contained" onClick={()=>confirm()}>
                    Confirm
                </Button>
            </DialogActions>
        </div>

    )
}
export default PopupOpenConflit