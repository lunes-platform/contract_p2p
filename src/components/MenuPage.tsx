import { Box, Button } from "@mui/material";
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookTwoTone';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
type HeaderProps = {
    clickOrder: any,
    clickMyTrader: any,
    clickBuyNow: any,
}
const MenuPage = ({...prop}:HeaderProps) => {
    return (
        <div>
            <Button
                startIcon={<ReceiptLongOutlinedIcon />}
                color="primary"
                style={{ fontSize: 18, marginTop: 20, marginLeft:10 }}
                onClick={prop.clickOrder}
                variant="contained">My Orders</Button>
            <Button variant="contained"
                startIcon={<BookOnlineOutlinedIcon />}
                color="primary"
                onClick={prop.clickMyTrader}
                style={{ fontSize: 18, marginTop: 20, marginLeft:10 }}>My Trader</Button>
             <Button variant="contained"
                startIcon={<CurrencyBitcoinIcon />}
                color="info"
                onClick={prop.clickBuyNow}
                style={{ fontSize: 18, marginTop: 20, marginLeft:10 }}>Buy Now</Button>    
            
        </div>
    )
}
export default MenuPage