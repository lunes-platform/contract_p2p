import * as React from 'react'
import Button from '@mui/material/Button'

import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'

import Timestamp from 'react-timestamp'
import { convertTimestamp, getPair } from '../utils/convert'
import { NFTStorage, File } from "nft.storage"
const NFT_STORE_API_KEY: string = process.env.REACT_APP_NFT_STORE_API_KEY || ""
type PopupProps = {
    handleClose: any,
    handleConfirm: any,
    order: any,
    enable: boolean,
    feeNetWork: any,
    getFee: any,
}
const PopupReceiptPage = ({ ...props }: PopupProps) => {
    const [receipt, setReceipt] = React.useState("");
    const [ipfs, setIpfs] = React.useState(false);
    const [sendConfirm, setSendconfirm] = React.useState(true);
    const [file, setFile] = React.useState<File | null>(null);

    React.useEffect(() => {
       
        if (props.enable)
            return
        if (!receipt && !file)
            setSendconfirm(true)
        else
            setSendconfirm(false)
        props.getFee(props.order.id, includ_link(receipt))
    }, [receipt, file])

    React.useEffect(() => {
        if (props.order.receipt) {
            let lik = props.order.receipt.toString().split(":");
            setReceipt(lik.length > 0 ? lik[1] : lik[0])            
        }
        console.log(props.order.receipt)
        const pair = getPair(props.order.pair);
        if(pair?.UPLOADFILE){
            setIpfs(true)
        }else
            setIpfs(false)

    }, [])
    const link_explorer = (txid: string) => {
        const pair = getPair(props.order.pair);
        return pair?.explorer + txid
    }
    const includ_link = (txid: string) => {        
        return "link:" + txid
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const storeAssetUpload = async () => {
        if (file) {
            const buffer = await file.arrayBuffer();
            const content = new Blob([buffer])
            const client = new NFTStorage({ token: NFT_STORE_API_KEY });
            const metaData = await client.storeBlob(content);
            return metaData;
        }
        return "";
    };
    const saveReceipt = async () =>{
        let fileipfs:string = "";
        if(!file && !receipt){
            return;
        }
        if(file){
            fileipfs = await storeAssetUpload()
        }else{
            fileipfs = receipt
        }
        props.handleConfirm(props.order.id, includ_link(fileipfs), props.order.sellEmail, props.order.pair)
        props.handleClose()
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
                    {ipfs ? (
                        <TextField
                            id="file"
                            label={`file PDF or IMG`}
                            fullWidth
                            disabled={props.enable}
                            type={"file"}
                            variant="filled"
                            onChange={handleFileChange}
                        />
                    ) : (
                        <TextField
                            label={`add txid`}
                            value={receipt}
                            fullWidth
                            disabled={props.enable}
                            onChange={(e) => setReceipt(e.target.value)}
                            type={"text"}
                            variant="filled"
                        />
                    )}

                </div>

                {props.order.receipt ? (
                    <a target='__blank' style={{background:"#DAE2ED",  marginBottom:20}} href={link_explorer(receipt)}>{props.order.receipt}</a>
                ) : (<></>)}
                
                <div style={{ color: "red" }}>Date expire to deposit: <Timestamp date={convertTimestamp(props.order.dateExpire)} /></div>
                <div style={{ color: "red" }}>Attention: Negotiations not completed result in a fine.</div>
            </DialogContent>
            <DialogActions>
                <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: {props.feeNetWork} LUNES </div>
                <Button onClick={props.handleClose} variant="text">
                    Close
                </Button>
                <Button hidden={props.enable} autoFocus color='primary' disabled={sendConfirm} variant="contained" onClick={() => saveReceipt()}>
                    Confirm
                </Button>
            </DialogActions>
        </div>

    )
}
export default PopupReceiptPage