
import { TextField, Autocomplete, Button, FormControl, InputLabel, InputAdornment, OutlinedInput, Typography, Dialog, Box, Alert, Select, MenuItem } from "@mui/material";
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
import { useEffect, useState } from "react";
import Order from "../models/Order";
import Timestamp from "react-timestamp";
import Identicon from "@polkadot/react-identicon";

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


type BookTradeProps = {
    books: any,
    clickSelectBuy: any,
    balance: number,
    info: any,
    clickCreateOrder: any,
    feeNetwork: any,
    getFee: any,
    isHavebalance: boolean,
    account: any,
    accounts: any,
    handleOnSelectAccount: any
}
const BookTradePage = ({ ...props }: BookTradeProps) => {
    const [order, setOrder] = useState(Order)
    const [total, setTotal] = useState("0")
    const [iserc20, setErc20] = useState(false)
    const [feeP2P, setFeeP2P] = useState("0")
    const [erro, setErro] = useState("")
    const [alert, setAlert] = useState(false)
    useEffect(() => {
        if (order.value) {
            const t = (Number(order.value) * Number(props.info.feeP2p)) / 100
            const tt = t + Number(order.value)
            const fee = t * 100000000
            order.fee = fee.toString()
            order.value = tt.toString()
            props.getFee(order)
            setFeeP2P(fee.toString())
            setTotal(tt.toString())
        }
    }, [order])
    const getKey = (pair: string) => {
        console.log(pair)
        if (!pair)
            return;
        return assets.pair_options.find(e => e.type == pair)
    }
    const getAmont = (value: string) => {
        return assets.values_type.find(e => e.value == value)
    }
    const handleAlertClose = () => {
        setAlert(false)
    }
    const convertTimestamp = (value: string) => {
        return value.replaceAll(",", "").toString().substring(0, 10)
    }
    const convertPrice = (value: string) => {
        return Number(value.replaceAll(",", "").toString()) / 100000000
    }
    const saveOrderHandler = () => {
        order.fee = feeP2P
        order.value = total.toString()
        let isErro = false
        if (!order.pair) {
            setErro("Select Pair")
            isErro = true
        }
        if (!isErro && !order.price) {
            setErro("Enter Price")
            isErro = true
        }
        if (!isErro && iserc20 && !order.erc20_address) {
            setErro("Enter Address")
            isErro = true
        }
        if (!isErro && !iserc20 && !order.btc_address) {
            setErro("Enter Address")
            isErro = true
        }
        if (!isErro && iserc20) {
            if (order.erc20_address.substring(0, 2) != "0x") {
                setErro("Enter Address Erc20 valid!")
                isErro = true
            }
        }
        if (!isErro && (!order.value || order.value == '0')) {
            isErro = true
            setErro("Enter Amount")
        }
        if (isErro) {
            setAlert(true);
            return;
        }

        props.clickCreateOrder(order)
        setOrder({ ...order, erc20_address: "", btc_address: "", decimal: 0, pair: "", info_payment: "", value: "" })
    }
    const setTypeAddress = (address: string) => {
        const key = getKey(order.pair)
        if (!key)
            return;
        if (key.ERC_20) {
            setOrder({ ...order, erc20_address: address, btc_address: "", decimal: key.DECIMAL })
            setErc20(true)
        } else {
            setErc20(false)
            setOrder({ ...order, btc_address: address, erc20_address: "0x0000000000000000000000000000000000000000", decimal: key.DECIMAL })
        }
    }
    const getBooks = () => {
        if (!props.books)
            return (<></>)

        return (


            <Table >
                <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="center">Pier</StyledTableCell>
                        <StyledTableCell align="right">Price</StyledTableCell>
                        <StyledTableCell align="right">Volume</StyledTableCell>
                        <StyledTableCell align="right">Time Expire</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.books.map((row: any) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell align="left">{row.id}</StyledTableCell>
                            <StyledTableCell align="center">
                                {row.pair}
                            </StyledTableCell>
                            <StyledTableCell align="right">{convertPrice(row.price)}</StyledTableCell>
                            <StyledTableCell align="right">{convertPrice(row.value)}</StyledTableCell>
                            <StyledTableCell align="right">
                                {<Timestamp date={convertTimestamp(row.dateExpire.toString())} />}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Button onClick={props.clickSelectBuy}>{props.account?.address == row.owner?("CANCEL"):("BUY")}</Button>
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
                            <InputLabel>Select Account</InputLabel>
                            <Select
                                fullWidth
                                value={props.account.address}
                                label="Select Account"
                                onChange={props.handleOnSelectAccount}
                            >
                                {props.accounts.map((account: any) => (
                                    <MenuItem key={account.address} value={account.address}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={1}>
                                                <Identicon
                                                    value={account.address}
                                                    theme='polkadot'
                                                    size={30}
                                                />
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography sx={{ fontWeight: 'bold' }}>{account.meta.name}</Typography>
                                                <Typography style={{ fontSize: 10 }}>{account.address}</Typography>
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <br/>

                        <div>
                            <Autocomplete
                                disablePortal
                                fullWidth
                                onChange={(e, value: any) => setOrder({ ...order, pair: value?.type })}
                                value={getKey(order.pair)}
                                options={assets.pair_options}
                                renderInput={(params) => <TextField   {...params} label="Pair" />}
                            />
                        </div>
                        <div>
                            <TextField
                                label={`Price`}
                                placeholder="0.00000"
                                value={order.price}
                                onChange={(e) => setOrder({ ...order, price: e.target.value })}
                                fullWidth
                                type={"number"}
                                variant="filled"
                            />
                        </div>
                        <div>

                            <TextField
                                label={`Address Payment`}
                                fullWidth
                                value={iserc20 ? order.erc20_address : order.btc_address}
                                onChange={(e) => setTypeAddress(e.target.value)}
                                type={"text"}
                                variant="filled"
                            />
                        </div>
                        <div>

                            <TextField
                                label={`Info to payment (optional)`}
                                fullWidth
                                value={order.info_payment}
                                onChange={(e) => setOrder({ ...order, info_payment: e.target.value })}
                                type={"text"}
                                variant="filled"
                            />
                        </div>
                        <div>
                            <Autocomplete
                                disablePortal
                                fullWidth
                                onChange={(e, value: any) => setOrder({ ...order, value: value?.value })}
                                value={getAmont(order.value)}
                                options={assets.values_type}
                                renderInput={(params) => <TextField   {...params} label="Amount" />}
                            />
                        </div>
                        <div>Fee P2P: {props.info.feeP2p}%</div>
                        <div>Fee Network: {props.feeNetwork} LUNES</div>
                        <div style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>Amount + Fee P2P: {total} LUNES</div>
                        <div>Time Expire: <Timestamp date={props.info.daysExpire.toString().substring(0, 10)} /> </div>
                        <div>
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={props.isHavebalance}
                                onClick={() => saveOrderHandler()}
                            >{!props.isHavebalance ? (<>Create Order</>) : (<>you don't have enough balance</>)}</Button>
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
            <Dialog onClose={handleAlertClose} open={alert}>
                <Box sx={{ width: '300px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Alert severity="error">{erro}</Alert>
                </Box>
                <Button
                    onClick={handleAlertClose}
                >
                    Close
                </Button>
            </Dialog>
        </div>

    )
}
export default BookTradePage