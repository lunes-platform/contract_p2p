
import { TextField, Autocomplete, Button, FormControl, InputLabel, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const rows = [
    { id: 1, pair: 'USDT/BNB', price: '0.003', volume: '35.0000',address:"USD: 0x0XDRTT...TYYYYSSSSSSS", time: 14444444 },
    { id: 1, pair: 'BTC', price: '0.00003', volume: '305.0000', address:"USD: 0x0XDRTT...TYYYYSSSSSSS", time: 14444444 },
    { id: 1, pair: 'USDT/BNB', price: '0.003', volume: '35.0000', address:"USD: 0x0XDRTT...TYYYYSSSSSSS", time: 14444444 },
    { id: 1, pair: 'BTC', price: '0.00003', volume: '305.0000',address:"USD: 0x0XDRTTmndwkndkwnkdwkndkwndkwnkdnwkTYYYYSSSSSSS",  time: 14444444 },

];
type BookTradeProps = {
    books: [],
    clickSelectConflit: any,
    clickSelectReceipt: any,
    clickSelectConfirm: any,
    clickSelectInfo: any,
    clickBuyOrder: any,
    clickSalesOrder: any,
    clickSelectClose: any,
    isSales:boolean,
    clickBack: any,
}
const MyOrdersPage = ({...props}:BookTradeProps) => {
    const truncate = (str:string) =>{
        return str.length > 20 ? str.substring(0, 15) + "..." : str;
    }
    const getBooks = () => {
        return (
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell align="center">Pier</StyledTableCell>
                            <StyledTableCell align="right">Price</StyledTableCell>
                            <StyledTableCell align="right">Volume</StyledTableCell>
                            <StyledTableCell align="right">Time Expire payment</StyledTableCell>
                            <StyledTableCell align="center">Info Deposit</StyledTableCell>                            
                            <StyledTableCell align="right"></StyledTableCell>
                            
                            <StyledTableCell align="right"></StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell align="left">{row.id}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.pair}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.price}</StyledTableCell>
                                <StyledTableCell align="right">{row.volume}</StyledTableCell>
                                <StyledTableCell align="right">{row.time}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button onClick={props.clickSelectInfo}><div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{truncate(row.address)}</div></Button>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button onClick={props.clickSelectReceipt}>Info Receipt</Button>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button onClick={props.clickSelectConflit}>Open conflit</Button>
                                </StyledTableCell>
                                {!props.isSales?(
                                     <StyledTableCell align="right">
                                     <Button onClick={props.clickSelectConfirm}>Confirm</Button>
                                 </StyledTableCell>
                                ):(
                                    <StyledTableCell align="right">
                                    <Button onClick={props.clickSelectClose}>Cnacel Trade</Button>
                                </StyledTableCell>
                                )}
                               

                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
        )
    }
    return (
        <div>
            <div onClick={props.clickBack} style={{float:"left", margin:20, justifyContent:"center"}}><a href="#"><ArrowBackIosNewOutlinedIcon/> Back</a></div>
            <Grid spacing={0} container
                direction="row"
                justifyContent="center"
            >
                <Grid item xs={12} style={{
                    textAlign: 'center',
                    color: '000',
                    padding: 10,

                }}>
                   <div style={{paddingBottom:10 }}>
                   All : {props.isSales?("Shopping"):("Sales")}
                      <Button onClick={props.clickBuyOrder} variant="contained" style={{marginLeft:10, marginRight:10}} >My Shopping</Button>
                      <Button onClick={props.clickSalesOrder} variant="contained" style={{marginLeft:10, marginRight:10}}>My Sales</Button>
                  </div>  
                    <Typography
                        sx={{
                            display: { xs: 'none', md: 'flex' }
                        }}
                    >
                         <TableContainer component={Paper} style={{marginBottom:50}}>
                            {getBooks()}
                         </TableContainer> 
                       
                    </Typography>
                    <Typography
                        sx={{
                            display: { xs: 'flex', md: 'none' }
                        }}
                    >
                        <TableContainer component={Paper} style={{marginBottom:50, width:350}}>
                            {getBooks()}
                         </TableContainer> 
                        
                    </Typography>
                </Grid>
            </Grid>
        </div>

    )
}
export default MyOrdersPage