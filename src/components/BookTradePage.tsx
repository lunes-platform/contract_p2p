
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
import assets from "../assets";

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
    { id: 1, pair: 'USDT/BNB', price: '0.003', volume: '35.0000', time: 14444444 },
    { id: 1, pair: 'BTC', price: '0.00003', volume: '305.0000', time: 14444444 },
    { id: 1, pair: 'USDT/BNB', price: '0.003', volume: '35.0000', time: 14444444 },
    { id: 1, pair: 'BTC', price: '0.00003', volume: '305.0000', time: 14444444 },

];
type BookTradeProps = {
    books: [],
    clickSelectBuy: any,
    balance:number,
    info:any
}
const BookTradePage = ({...props}:BookTradeProps) => {
    const getBooks = () => {
        return (

           
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell align="center">Pier</StyledTableCell>
                            <StyledTableCell align="right">Price</StyledTableCell>
                            <StyledTableCell align="right">Volume</StyledTableCell>
                            <StyledTableCell align="right">Time</StyledTableCell>
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
                                <StyledTableCell align="right">
                                    <Button onClick={props.clickSelectBuy}>BUY</Button>
                                </StyledTableCell>

                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
        )
    }
    return (
        <div>
            <Grid spacing={0} container
                direction="row"
                justifyContent="center"
            >
                <Grid item xs={12} md={3} style={{
                    textAlign: 'center',
                    color: '#000',
                    padding: 10,
                }}>
                    <div className="boxInfoHeader" style={{ padding: 20, marginBottom: 50 }}>
                        <div>Your Balnace:{props.balance} LUNES</div>
                        <div>
                            <Autocomplete
                                disablePortal
                                fullWidth
                                options={assets.pair_options}
                                renderInput={(params) => <TextField   {...params} label="Pair" />}
                            />
                        </div>
                        <div>
                            <TextField                                
                                label={`Price`}
                                placeholder="0.00000"
                                fullWidth
                                type={"number"}
                                variant="filled"
                            />
                        </div>
                        <div>
                        
                            <TextField
                                label={`Address Payment`}
                                fullWidth
                                type={"text"}
                                variant="filled"
                            />
                        </div>
                        <div>
                        
                            <TextField
                                label={`Info to payment (optional)`}
                                fullWidth
                                type={"text"}
                                variant="filled"
                            />
                        </div>
                        <div>
                            <Autocomplete
                                disablePortal
                                fullWidth
                                options={assets.values_type}
                                renderInput={(params) => <TextField   {...params} label="Amount" />}
                            />
                        </div>
                        <div>Fee P2P: {props.info.feeP2p}%</div>
                        <div>Fee Network: {props.balance} LUNES</div>
                        <div style={{textAlign:"center", fontSize:18, fontWeight:"bold"}}>Amount + Fee P2P: 10030 LUNES</div>
                        <div>Time Expire: 7days</div>
                        <div>
                            <Button variant="contained" fullWidth>Create Order</Button>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={6} style={{
                    textAlign: 'center',
                    color: '000',
                    padding: 10,

                }}>
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
export default BookTradePage