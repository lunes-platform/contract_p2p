
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import WalletSharpIcon from '@mui/icons-material/Wallet';
type PopupProps = {
    handleClose: any,
}
const WalletConnectPage = ({ ...props }: PopupProps) => {
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
                    <Button variant="contained" style={{ minHeight: 60, fontSize: 20 }} startIcon={<WalletSharpIcon />} onClick={props.handleClose}>Connect Wallet</Button>
                </div>
            </Grid>
            <Grid item xs={12} style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
                <div style={{ fontSize: 20, fontWeight: "bold" }}>Download Now</div>
            </Grid>
            <Grid item xs={12} md={3} style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
                <a target="_blank" href="https://polkadot.js.org/extension/">
                    <div>
                        <img src={`img/poikadot.svg`} style={{ width: "200px", margin: "auto" }} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: "bold" }}>
                        Wallet Polkadot extension
                    </div>
                </a>

            </Grid>
            <Grid item xs={12} md={3} style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
                <a target="_blank" href="https://www.talisman.xyz/download">
                    <div>
                        <img src={`img/talisman.png`} style={{ width: "200px", margin: "auto" }} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: "bold" }}>
                        Wallet Talisman
                    </div>
                </a>
            </Grid>
            <Grid item xs={12} md={3} style={{
                textAlign: 'center',
                color: '#000',
                padding: 10,
            }}>
                <a target="_blank" href="https://www.subwallet.app/download.html">
                    <div>
                        <img src={`img/subwallet.png`} style={{ width: "200px", margin: "auto" }} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: "bold" }}>
                        Wallet Subwallet
                    </div>
                </a>

            </Grid>
            <Grid item xs={12}
                style={{
                    textAlign: 'left',
                    color: '#000',
                    fontSize:18,
                    padding: 50,
                    marginBottom:50
                }}>
                <div>
                    <h2>Decentralized P2P Rules:</h2>

                    <p>Our peer-to-peer (P2P) system operates with a set of conditions aimed at ensuring transparency, security, and efficiency in transactions. Below are the main rules to be followed:</p>

                    <ol>
                        <li><strong>Transaction Fee:</strong><br />
                            Every P2P transaction will be subject to a fee, which will be automatically deducted from the total transaction amount.</li>

                        <li><strong>Trading Time:</strong><br />
                            The system will determine a specific time for the completion of the P2P transaction.</li>

                        <li><strong>Penalty for Non-Execution:</strong><br />
                            If a P2P purchase is not executed, a penalty will be applied. This penalty must be paid before making a new purchase.</li>

                        <li><strong>Value Reservation for 24h:</strong><br />
                            When making a purchase in P2P, the value will be reserved for 24 hours, awaiting the seller's deposit.</li>

                        <li><strong>Cancellation by the Seller:</strong><br />
                            The seller can cancel the sell order at any time. However, transactions cannot be canceled until 24 hours after opening if not executed.</li>

                        <li><strong>Cancellation due to Lack of Proof:</strong><br />
                            If the purchase/negotiation is not reported with the deposit receipt within 24 hours, the seller has the right to cancel the transaction at any time.</li>

                        <li><strong>Buyer's Responsibility:</strong><br />
                            The buyer is responsible for notifying the seller about the purchase, providing the deposit receipt to ensure the reservation of assets.</li>

                        <li><strong>Dispute/Conflict:</strong><br />
                            In case of a dispute, if the seller does not deposit within 24 hours and the buyer provides the receipt, the assets will be automatically sent to the buyer. Otherwise, in case of fraud, the buyer will pay a penalty.</li>
                    </ol>

                    <p>These are the main guidelines for the operation of our decentralized P2P. We recommend careful reading and understanding of these rules before initiating any transaction.</p>
                </div>
            </Grid>

        </Grid>
    )
}
export default WalletConnectPage