
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import WalletSharpIcon from '@mui/icons-material/Wallet';
type PopupProps = {
    handleClose: any,
}
const WalletConnectPage = ({...props}:PopupProps) => {
    return (
        <Grid spacing={0} container
            direction="row"
            justifyContent="center"
        >
            <Grid item xs={12} style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
                <div>
                    <Button variant="contained" startIcon={<WalletSharpIcon />} onClick={props.handleClose}>Connect Wallet</Button>
                </div>
            </Grid>
            <Grid item xs={12} style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
               <div style={{fontSize:20, fontWeight:"bold"}}>Download Now</div>
            </Grid>
            <Grid item xs={12} md={2} style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
                <a target="_blank" href="https://www.talisman.xyz/download">
                    <div>
                        <img src={`img/talisman.png`} style={{ width: "200px",margin:"auto" }} />
                    </div>
                    <div style={{fontSize:20, fontWeight:"bold"}}>
                    Wallet Talisman
                    </div>
                </a>
            </Grid>
            <Grid item xs={12} md={2}  style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
                <a target="_blank" href="https://www.subwallet.app/download.html">
                    <div>
                        <img src={`img/subwallet.png`} style={{ width: "200px", margin:"auto" }}  />
                    </div>
                    <div style={{fontSize:20, fontWeight:"bold"}}>
                        Wallet Subwallet
                    </div>
                </a>
                
            </Grid>

        </Grid>
    )
}
export default WalletConnectPage