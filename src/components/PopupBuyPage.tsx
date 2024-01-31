import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField } from '@mui/material';
import assets from '../assets';
import { convertAmountLunes, convertTimestamp, getAmont } from '../utils/convert';
import Timestamp from 'react-timestamp';

type PopupProps = {
    handleClose: any,
    handleConfirm: any,
    handleBestPrice: any,
    order: any,
    feeNetWork: any
}
const PopupBuyPage = ({ ...props }: PopupProps) => {
    const [amount, setAmount] = React.useState("1000")
    const [amountList, setAmountList] = React.useState(assets.values_type)
    const [isConfirm, setIsConfirm] = React.useState(false)
    const [email, setEmail] = React.useState("")
    React.useEffect(()=>{
        let email_local = sessionStorage.getItem("email")
        if(email_local)
            setEmail(email_local)
    }, [])

    React.useEffect(() => {
        if (props.order?.value) {
            let permList = assets.values_type.filter(el => Number(el.value) <= convertAmountLunes(props.order?.value.toString()))
            setAmountList(permList)
        }
    }, [props.order])

    React.useEffect(() => {
        let v = Number(props.feeNetWork) == 0
        setIsConfirm(v)
    }, [props.feeNetWork])

    React.useEffect(() => {
        if (!amount)
            setIsConfirm(true)
        else
            setIsConfirm(false)
    }, [amount])
    const getTotal = () => {
        let price_ = convertAmountLunes(props.order.price)
        let amount_ = Number(amount)
        let tt = price_ * amount_

        return tt || 0
    }
    const confirmHandle = () => {
        let a = Number(amount) * 100000000
        props.order.email = email;
        sessionStorage.setItem("email",email)
        props.handleConfirm(props.order.id, a,email, props.order.sellOwner, amount, props.order.pair)
        props.handleClose()
    }
    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
                ID - {props.order.id} Buy LUNES
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

                {/*
               <div>
                    <Autocomplete
                        disablePortal
                        fullWidth
                        value={}
                        options={assets.values_type}
                        renderInput={(params) => <TextField   {...params} label="Amount" />}
                    />
                </div>
                <div>
                    <Autocomplete
                        disablePortal
                        fullWidth
                        options={assets.pair_options}
                        renderInput={(params) => <TextField   {...params} label="Pair" />}
                    />
                </div>
               */ }
                <div>
                    <Autocomplete
                        disablePortal
                        fullWidth
                        onChange={(e, value: any) => setAmount(value?.value)}
                        value={getAmont(amount)}
                        options={amountList}
                        renderInput={(params) => <TextField   {...params} label="Amount" />}
                    />
                </div>
                <div>
                    <TextField
                        label={`email address for notification`}
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type={"email"}

                        variant="filled"
                    />
                </div>
                <div>Volume: {convertAmountLunes(props.order.value)} LUNES</div>
                <div>Price Uni: {convertAmountLunes(props.order.price)}  {props.order.pair}</div>
                <div>Total: {getTotal()}  {props.order.pair}</div>
                <div>Date expire to deposit:   {<Timestamp date={convertTimestamp(props.order.dateExpire)} />}</div>
                <div style={{ color: "red" }}>Attention: Negotiations not completed result in a fine, confirm?</div>
            </DialogContent>
            <DialogActions>
                <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: {props.feeNetWork} LUNES </div>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button autoFocus color='primary' variant="contained" disabled={isConfirm} onClick={() => confirmHandle()}>
                    Confirm
                </Button>
            </DialogActions>
        </div>

    )
}
export default PopupBuyPage