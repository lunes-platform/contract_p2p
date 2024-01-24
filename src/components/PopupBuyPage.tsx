import * as React from 'react';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField } from '@mui/material';
import assets from '../assets';

type PopupProps = {
    handleClose: any,
}
const PopupBuyPage = ({ ...props }: PopupProps) => {

    return (
        <div>
            <DialogTitle sx={{ m: 0, p: 2 }} >
                Buy LUNES
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
                    <Autocomplete
                        disablePortal
                        fullWidth
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

                <div>Amount Search: 100 LUNES</div>
                <div>Price Uni: 0.03 USDT</div>
                <div>Total: 3.00 USDT</div>
                <div>Date expire to deposit: 12/01/2023 10:19</div>
                <div style={{ color: "red" }}>Attention: Negotiations not completed result in a fine, confirm?</div>
            </DialogContent>
            <DialogActions>
                <div style={{ margin: "auto", alignItems: "flex-start" }}>Fee Network: 0.0011</div>
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
export default PopupBuyPage