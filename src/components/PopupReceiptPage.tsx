import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField } from '@mui/material';
import assets from '../assets';
import Timestamp from 'react-timestamp';
import { convertTimestamp, getPair } from '../utils/convert';

type PopupProps = {
    handleClose: any,
    handleConfirm: any,
    order:any,   
    enable:boolean, 
    feeNetWork:any,
    getFee:any,
}
const PopupReceiptPage = ({ ...props }: PopupProps) => {
    const [receipt, setReceipt] = React.useState("");
    const [sendConfirm, setSendconfirm] = React.useState(true);
    React.useEffect(()=>{
        props.getFee(props.order.id,includ_link(receipt))
        if(props.enable)
            return
        if(!receipt)
            setSendconfirm(true)
        else
            setSendconfirm(false)
    },[receipt])
    React.useEffect(() => {
        let v = Number(props.feeNetWork) ==0
        setSendconfirm(v)
    },[props.feeNetWork])
    React.useEffect(()=>{
        if(props.order.receipt){
            let lik = props.order.receipt.toString().split(":");
            setReceipt(lik.length>0?lik[1]:lik[0])
        }
            
    },[])
    const link_explorer = (txid:string) =>{
        const pair = getPair(props.order.pair);
        return pair?.explorer + txid
    }
    const includ_link = (txid:string) =>{
        const pair = getPair(props.order.pair);
        return "link:" + txid
    }
    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
            ID: {props.order.id} - Sender Receipt
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
                
                
                <div>
                    <TextField
                        label={`add txid`}
                        value={receipt}
                        fullWidth
                        disabled={props.enable}
                        onChange={(e)=>setReceipt(e.target.value)}
                        type={"text"}
                        variant="filled"
                    />
                </div>

                {props.enable?(
                    <a target='__blank' href={link_explorer(receipt)}>{props.order.receipt}</a>
                ):(<></>)}
                <div style={{color:"red"}}>Date expire to deposit: <Timestamp date={convertTimestamp(props.order.dateExpire)} /></div>
                <div style={{color:"red"}}>Attention: Negotiations not completed result in a fine.</div>
            </DialogContent>
            <DialogActions>
            <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: {props.feeNetWork} LUNES </div>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button hidden={props.enable} autoFocus color='primary' disabled={sendConfirm} variant="contained" onClick={()=>{props.handleConfirm(props.order.id,includ_link(receipt),props.order.sellEmail,props.order.pair ); props.handleClose()}}>
                    Confirm
                </Button>
            </DialogActions>
        </div>

    )
}
export default PopupReceiptPage