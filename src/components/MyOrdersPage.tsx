
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
import { convertAmountCoin, convertAmountLunes, convertTimestamp, getPairLabel, getPairType, getTotalPayment } from "../utils/convert";
import Timestamp from "react-timestamp";
const StyledTableCell: any = styled(TableCell)(({ theme }) => ({
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

type BookTradeProps = {
    books: any,
    clickSelectConflit: any,
    clickSelectReceipt: any,
    clickSelectConfirm: any,
    clickSelectInfo: any,
    clickBuyOrder: any,
    clickSalesOrder: any,
    clickSelectClose: any,
    clickOpenConfirConflit: any,
    account: any,
    clickBack: any,
    ownerContract: any,
    clickOrderWithConflit: any
}
const MyOrdersPage = ({ ...props }: BookTradeProps) => {

    const truncate = (str: string) => {
        return str.length > 20 ? str.substring(0, 15) + "..." : str;
    }
    const permition_payment = (address: string) => {
        return props.account.address == address;
    }
    const optionsConfirmOrde = (row: any) => {
        if (props.ownerContract == props.account.address) {
            return (
                <StyledTableCell align="right">
                    <Button onClick={() => props.clickOpenConfirConflit(row)}>Confirm conflit</Button>
                </StyledTableCell>
            )
        } else {
            if (permition_payment(row.sellOwner)) {
                return (
                    <StyledTableCell align="right">
                        <Button disabled={row.confirmed} onClick={() => props.clickSelectConfirm(row)}>Confirm</Button>
                    </StyledTableCell>
                )
            } else
                return (
                    <StyledTableCell align="right">
                        <Button disabled={row.confirmed} onClick={() => props.clickSelectClose(row)}>Cancel Trade</Button>
                    </StyledTableCell>
                )


        }
    }
    const getBooks = () => {
        return (
            <Table >
                <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="center">Pier</StyledTableCell>
                        <StyledTableCell align="right">Price Uni.</StyledTableCell>
                        <StyledTableCell align="right">reserved Amount</StyledTableCell>
                        <StyledTableCell align="right">Payment Amount</StyledTableCell>
                        <StyledTableCell align="center">Info Deposit</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>

                        <StyledTableCell align="right"></StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.books.map((row: any) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell align="left">{row.id}</StyledTableCell>
                            <StyledTableCell align="center">
                                {getPairLabel(row.pair)}
                            </StyledTableCell>
                            <StyledTableCell align="right">{convertAmountCoin(row.price,row.pair)}</StyledTableCell>
                            <StyledTableCell align="right">{convertAmountLunes(row.value)} LUNES</StyledTableCell>
                            <StyledTableCell align="right">{getTotalPayment(row.price, row.value,row.pair)}  {getPairType(row.pair)}</StyledTableCell>                           
                            <StyledTableCell align="center">
                                <Button onClick={() => props.clickSelectInfo(row)}>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {row.infoPayment}
                                        <br />
                                        {truncate(row.btcAddress ? row.btcAddress : row.erc20Address)}
                                    </div>
                                </Button>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Button disabled={row.confirmed} onClick={() => props.clickSelectReceipt(row)}>Info Receipt</Button>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                            {row.conflict?(
                                        <>
                                            In Dispute/Conflict -  wait
                                        </>
                                    ):(
                                        <Button  disabled={row.confirmed} onClick={()=>props.clickSelectConflit(row)}>
                                        Open conflit
                                        </Button>
                                    )}
                            </StyledTableCell>
                            {optionsConfirmOrde(row)}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
    return (
        <div>
            <div onClick={props.clickBack} style={{ float: "left", margin: 20, justifyContent: "center" }}><a href="#"><ArrowBackIosNewOutlinedIcon /> Back</a></div>
            <Grid spacing={0} container
                direction="row"
                justifyContent="center"
            >
                <Grid item xs={12} style={{
                    textAlign: 'center',
                    color: '000',
                    padding: 10,

                }}>
                    <div style={{ paddingBottom: 10 }}>
                        Select:
                        <Button onClick={props.clickBuyOrder} variant="contained" style={{ marginLeft: 10, marginRight: 10 }} >My Purchase Orders</Button>
                        <Button onClick={props.clickSalesOrder} variant="contained" style={{ marginLeft: 10, marginRight: 10 }}>My Sell Orders</Button>
                        {props.ownerContract == props.account.address ? (
                            <>
                                <Button onClick={() => props.clickOrderWithConflit("1")} variant="contained" style={{ marginLeft: 10, marginRight: 10 }}>Order with Conflit</Button>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <Typography
                        sx={{
                            display: { xs: 'none', md: 'flex' }
                        }}
                    >
                        <TableContainer component={Paper} style={{ marginBottom: 50 }}>
                            {getBooks()}
                        </TableContainer>

                    </Typography>
                    <Typography
                        sx={{
                            display: { xs: 'flex', md: 'none' }
                        }}
                    >
                        <TableContainer component={Paper} style={{ marginBottom: 50, width: 350 }}>
                            {getBooks()}
                        </TableContainer>

                    </Typography>
                </Grid>
            </Grid>
        </div>

    )
}
export default MyOrdersPage