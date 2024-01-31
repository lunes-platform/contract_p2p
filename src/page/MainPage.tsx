import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import FooterPage from "../components/FooterPage";
import HeaderPage from "../components/HeaderPage";
import MenuPage from "../components/MenuPage";
import BookTradePage from "../components/BookTradePage";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import PopupBuyPage from "../components/PopupBuyPage";
import PopupInfoPaymentPage from "../components/PopupInfoPaymentPage";
import MyOrdersPage from "../components/MyOrdersPage";
import PopupReceiptPage from "../components/PopupReceiptPage";
import PopupOpenConflit from "../components/PopupOpenConflit";
import PopupOpenCancel from "../components/PopupOpenCancel";
import PopupOpenConfirm from "../components/PopupOpenConfirm";
import WalletConnectPage from "../components/WalletConnectPage";
import ContractService from "../hooks/ContractService";
import { Alert, Button, CircularProgress } from "@mui/material";
import PopupOpenCancelOwner from "../components/PopupOpenCancelOwner";
import { convertAmountLunes } from "../utils/convert";
import PopupConflitApprovPaymentPage from "../components/PopupConflitApprovPaymentPage";
const classes = {
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center",
    color: "white",
    padding: 5,
  },
  buttonStay: {
    color: "#000000",
    border: "1px solid #DAE2ED",
    borderRadius: "30px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
const MainPage = () => {
  const [pageType, setPageType] = React.useState("home");
  const [open, setOpen] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openReceipt, setOpenReceipt] = React.useState(false);
  const [openConflit, setOpenConflit] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openOrderCancelOwner, setOrderCancelOwner] = React.useState(false);
  const [order, setOrder] = React.useState();
  const [orderBuy, setOrderbuy] = React.useState()
  const [alert, setAlert] = React.useState(false)
  const [anableReceipt, setEnableReceipt] = React.useState(false)
  const [openPaymentconfirmconclit, setOpenPaymentConfirConflit] = React.useState(false);

  const {
    infoContractHandler,
    infoTraded24hHandler,
    connectWalletHandler,
    contract,
    balanceLunes,
    infContract,
    inf24h,
    loading,
    account,
    successMsg,
    error,
    alltrader,
    contractReady,
    allBooksHandler,
    allOrderOwnerHandler,
    feeNwtWorkOrderHandler,
    createOrderHandler,
    cancelOrderSellerHandler,
    feeCancelOrderSellerHandler,
    allbooks,
    feeNetword,
    setLoading,
    handleOnSelect,
    accounts,
    feeBuyOrderHandler,
    buyOrderHandler,
    buyBooksUserHandler,
    buyBooksSellerHandler,
    feeReceiptSellHandler,
    sendReceiptSellHandler,
    feeOpenConflictSellerHandler,
    openConflictSellerHandler,
    feeCloseBuyUserHandler,
    closeBuyUserHandler,
    feeConfirmSellHandler,
    confirmSellHandler,
    openConflictUserHandler,
    feeOpenConflictUserHandler,
    ownerContract,
    allOrderWithConflitHandler,
    transferConflictSeleHandler,
    feeTransferConflictSeleHandler
  } = ContractService();

  useEffect(() => {
      infoContractHandler()
  }, [contract])
  useEffect( () => {
    if(account)
      infoTraded24hHandler()
  }, [account])
  useEffect(() => {
    setPageType("home")
  }, [infContract])
  useEffect(()  => {
      allBooksHandler("1")    
  }, [contract])
  useEffect(() => {
    if (error || successMsg)
      setAlert(true)
  }, [error, successMsg])


  const handleLoadinglose = () => {
    setLoading(false)
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };
  const handleCloseReceipt = () => {
    setOpenReceipt(false);
  };
  const handleCloseConflit = () => {
    setOpenConflit(false);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleCloseConfirmConflit = () => {
    setOpenPaymentConfirConflit(false);
  };

  const handleConnectWallet = async () => {
    await connectWalletHandler();
  };
  const handleCreateOrder = async (order: any) => {
    createOrderHandler(order.price, order.fee, order.pair, order.erc20_address, order.btc_address, order.info_payment, order.value, order.email)
  };
  const handleFeeCreateOrder = async (order: any) => {
    feeNwtWorkOrderHandler(order.price, order.fee, order.pair, order.erc20_address, order.btc_address, order.info_payment, order.value, order.email)
  };
  const handleCloseOrderCancelOwner = () => {
    setOrderCancelOwner(false)
  };
  const handleConfirmOrderCancelOwner = async (id: string) => {
    await cancelOrderSellerHandler(id)
    setOrderCancelOwner(false)
  };
  const handleOpemOrderCancelOwner = (order_:any) => {
    setOrder(order_)
    feeCancelOrderSellerHandler(order_?.id)
    setOrderCancelOwner(true)
  };
  const handleSelectBuy = (order_: any) => {
    setOrder(order_)
    let qty = (convertAmountLunes(order_?.value)) *100000000
    console.log(order_)
    feeBuyOrderHandler(order_?.id, qty.toString(), order_.email)
    setOpen(true)
  }
  const handleBuyClose = () => {
    setOpen(false);
  };
  const handleConfirmOrderBuy = async (id: string, amount:string,email:string, email_sell:string, total:string, pair:string) => {
    await buyOrderHandler(id,amount,email, email_sell,total, pair)
    setPageType("order")
  };
  const handleAllTraderUser = async () =>{
    setLoading(true)
    await buyBooksUserHandler("1")
    setPageType("order")
    setLoading(false)
  }
  const handleOrderBuy = async () => {
    setLoading(true)
    await buyBooksUserHandler("1")
    setLoading(false)
  };
  const handleOrderSales = async () => {
    setLoading(true)
    await buyBooksSellerHandler("1")
    setLoading(false)
  };
  const handleInfoPayment = (order_buy:any) => {
    setOrderbuy(order_buy)
    setOpenInfo(true)
  }
  const handleInfoReceipt = (order_buy:any) => {
    setOrderbuy(order_buy)
    if(account?.address == order_buy.sellOwner)
      setEnableReceipt(true)
    feeReceiptSellHandler(order_buy.id, "b4505fd7ed20c11e7fc23f69aaabae559cca34e45d26e7c7c40ab7b59819f49f")
    setOpenReceipt(true)
  }
  const handleOpenconflit = (order_buy:any) => {
    setOrderbuy(order_buy)
    if(account?.address == order_buy.sellOwner)
      feeOpenConflictSellerHandler(order_buy.id)
    else
      feeOpenConflictUserHandler(order_buy.id)
    setOpenConflit(true)
  }
  const handleConfirmPayment = (order_buy:any) => {
    setOrderbuy(order_buy)
    feeConfirmSellHandler(order_buy.id)
    setOpenConfirm(true)
  }
  const handleCancelOrder = (order_buy:any) => {
    setOrderbuy(order_buy)
    let amount = convertAmountLunes(order_buy.value);
    feeCloseBuyUserHandler(order_buy.id, amount.toString())
    setOpenCancel(true)
  }
  const handlePaymentconfirmconclit = (order_buy:any) => {    
    setOrderbuy(order_buy)
    feeTransferConflictSeleHandler(order_buy.id, false)
    setOpenPaymentConfirConflit(true)
  }
  const pagesView = () => {
    if (pageType == 'home') {
      return (<>
        <MenuPage
          clicAllkOrder={() => allBooksHandler("1")}
          clickOrder={() => allOrderOwnerHandler("1")}
          //clickBuyNow={() => setOpen(true)}
          clickMyTrader={() => handleAllTraderUser()} />
        <BookTradePage
          account={account}
          accounts={accounts}
          clickSelectCancel={handleOpemOrderCancelOwner}
          handleOnSelectAccount={handleOnSelect}
          getFee={handleFeeCreateOrder}
          clickCreateOrder={handleCreateOrder}
          feeNetwork={feeNetword}
          info={infContract}
          balance={balanceLunes}
          books={allbooks}
          clickSelectBuy={handleSelectBuy} />
      </>
      )
    }

    if (pageType == 'order') {
      return (<MyOrdersPage
                clickBuyOrder={() => handleOrderBuy()}
                clickSalesOrder={() => handleOrderSales()}
                clickSelectConfirm={handleConfirmPayment}
                clickSelectConflit={handleOpenconflit}
                clickSelectReceipt={handleInfoReceipt}
                clickSelectClose={handleCancelOrder}
                clickOrderWithConflit={allOrderWithConflitHandler}
                clickOpenConfirConflit={handlePaymentconfirmconclit}
                ownerContract={ownerContract}
                books={alltrader}
                account={account}
                clickBack={() => setPageType("home")}
                clickSelectInfo={handleInfoPayment} />)
    }
  }
  const handleAlertClose = () => {
    setAlert(false)
  }
  return (
    <React.Fragment>
      <Dialog onClose={handleLoadinglose} open={loading}>
        <Box sx={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Dialog>
      <HeaderPage 
        info={inf24h} 
        onBack={setPageType}
        isReady={contractReady} />

      <Box
        component="form"
        style={{ display: "flex", alignItems: "center", textAlign: "center" }}
        noValidate
        autoComplete="off"
      >
        <div style={classes.root}>
          {!contractReady ? (<WalletConnectPage handleClose={() => handleConnectWallet()} />) : (pagesView())}

        </div>
      </Box>
      <BootstrapDialog
        onClose={handleBuyClose}
        key={2}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <PopupBuyPage 
          feeNetWork={feeNetword}
          handleBestPrice={()=>{}}
          order={order}
          handleConfirm={handleConfirmOrderBuy}
          handleClose={handleBuyClose} />
      </BootstrapDialog>
      <BootstrapDialog
        key={3}
        onClose={handleCloseInfo}
        aria-labelledby="customized-dialog-title"
        open={openInfo}
      >
        <PopupInfoPaymentPage 
          order={orderBuy}
          handleClose={handleCloseInfo} />
      </BootstrapDialog>
      <BootstrapDialog
        key={4}
        onClose={handleCloseReceipt}
        aria-labelledby="customized-dialog-title"
        open={openReceipt}
      >
        <PopupReceiptPage 
          feeNetWork={feeNetword}
          getFee={feeReceiptSellHandler}
          enable={anableReceipt}
          handleConfirm={sendReceiptSellHandler}
          order={orderBuy}
          handleClose={handleCloseReceipt} />
      </BootstrapDialog>
      <BootstrapDialog
        key={5}
        onClose={handleCloseConflit}
        aria-labelledby="customized-dialog-title"
        open={openConflit}
      >
        <PopupOpenConflit 
          account={account}
          feeNetWork={feeNetword}
          handleSallerConfirm={openConflictSellerHandler}
          handleUserConfirm={openConflictUserHandler}
          info={infContract}
          order={orderBuy}      
          handleClose={handleCloseConflit} />
      </BootstrapDialog>
      <BootstrapDialog
        key={6}
        onClose={handleCloseCancel}
        aria-labelledby="customized-dialog-title"
        open={openCancel}
      >
        <PopupOpenCancel 
          feeNetWork={feeNetword}
          handleConfirm={closeBuyUserHandler}
          info={infContract}
          order={orderBuy}        
          handleClose={handleCloseCancel} />
      </BootstrapDialog>
      <BootstrapDialog
        key={7}
        onClose={handleCloseConfirm}
        open={openConfirm}
      >
        <PopupOpenConfirm 
          feeNetWork={feeNetword}
          handleConfirm={confirmSellHandler}
          order={orderBuy}        
          handleClose={handleCloseConfirm} />
      </BootstrapDialog>
      <BootstrapDialog
        key={8}
        onClose={handleCloseOrderCancelOwner}
        open={openOrderCancelOwner}
      >
        <PopupOpenCancelOwner
          feeNetWork={feeNetword}
          handleConfirm={handleConfirmOrderCancelOwner}
          order={order}
          handleClose={handleCloseOrderCancelOwner} />
      </BootstrapDialog>
      <BootstrapDialog
        key={9}
        onClose={handleCloseConfirmConflit}
        open={openPaymentconfirmconclit}
      >
        <PopupConflitApprovPaymentPage
          feeNetWork={feeNetword}
          handleConfirm={transferConflictSeleHandler}
          order={orderBuy}
          handleClose={handleCloseConfirmConflit} />
      </BootstrapDialog>
      <Dialog onClose={handleAlertClose} open={alert}>
        <Box sx={{ width: '300px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {error ? (
            <Alert severity="error" > {error}</Alert>
          ) : (
            <Alert severity="success">{successMsg}</Alert>
          )}
        </Box>
        <Button
          onClick={handleAlertClose}
        >
          Close
        </Button>
      </Dialog>
      <FooterPage />
    </React.Fragment>
  );
};
export default MainPage;
