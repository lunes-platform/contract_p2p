import React, { useContext, useEffect } from "react";
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
  const [isSales, setIsSales] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openReceipt, setOpenReceipt] = React.useState(false);
  const [openConflit, setOpenConflit] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openHome, setOpenHome] = React.useState(false);
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
          apiReady,
          contractReady, 
          allBooksHandler
  } = ContractService();

  useEffect(()=>{
    infoContractHandler()      
  },[contract])
  useEffect(()=>{
    infoTraded24hHandler()      
  },[contract])
  useEffect(()=>{
    setPageType("home")      
  },[infContract])
  useEffect(()=>{
    allBooksHandler("1")      
  },[infContract])

  const handleClose = () => {
    setOpen(false);
    setOpenInfo(true);
  };
  const handleSelectBuy = () => {
    setOpen(true)
  }
  const handleCloseInfo = () => {
    setOpenInfo(false);
  };
  const handleCloseReceipt= () => {
    setOpenReceipt(false);
  };
  const handleCloseConflit= () => {
    setOpenConflit(false);
  };
  const handleCloseCancel= () => {
    setOpenCancel(false);
  };
  const handleCloseConfirm= () => {
    setOpenConfirm(false);
  };
  const handleOrderBuy= () => {
    setIsSales(true);
  };
  const handleOrderSales= () => {
    setIsSales(false);
  };
  const handleConnectWallet= async () => {
    await connectWalletHandler();   
  };
  const pagesView = () => {
    if (pageType == 'home'){
      return (<>
        <MenuPage
          clickOrder={()=>{}}
          clickBuyNow={() => setOpen(true)}
          clickMyTrader={() =>setPageType("order")}/>
        <BookTradePage info={infContract} balance={balanceLunes} books={[]} clickSelectBuy={handleSelectBuy} />
      </>
      )
    }
   
    if (pageType == 'order'){
      return (<MyOrdersPage 
          clickBuyOrder={()=>handleOrderBuy()} 
          clickSalesOrder={()=>handleOrderSales()}
          clickSelectConfirm={()=>setOpenConfirm(true)}
          clickSelectConflit={()=>setOpenConflit(true)}
          clickSelectReceipt={()=>setOpenReceipt(true)}
          clickSelectClose={()=>setOpenCancel(true)}
          books={[]}
          isSales={isSales}          
          clickBack={()=>setPageType("home")}
          clickSelectInfo={()=>setOpenInfo(true)}/>)
    } 
  }
  return (
    <React.Fragment>
      <HeaderPage Valume={inf24h.valume} isReady={contractReady} totalTraded={inf24h.trander} />

      <Box
        component="form"
        style={{ display: "flex", alignItems: "center", textAlign: "center" }}
        noValidate
        autoComplete="off"
      >
        <div style={classes.root}>
          {!contractReady?(<WalletConnectPage handleClose={()=>handleConnectWallet()}/>):(pagesView())}
          
        </div>
      </Box>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <PopupBuyPage handleClose={handleClose} />
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleCloseInfo}
        aria-labelledby="customized-dialog-title"
        open={openInfo}
      >
        <PopupInfoPaymentPage handleClose={handleCloseInfo} />
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleCloseReceipt}
        aria-labelledby="customized-dialog-title"
        open={openReceipt}
      >
        <PopupReceiptPage handleClose={handleCloseReceipt} />
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleCloseConflit}
        aria-labelledby="customized-dialog-title"
        open={openConflit}
      >
        <PopupOpenConflit handleClose={handleCloseConflit} />
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleCloseCancel}
        aria-labelledby="customized-dialog-title"
        open={openCancel}
      >
        <PopupOpenCancel handleClose={handleCloseCancel} />
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleCloseConfirm}
        aria-labelledby="customized-dialog-title"
        open={openConfirm}
      >
        <PopupOpenConfirm handleClose={handleCloseConfirm} />
      </BootstrapDialog>
      <FooterPage />
    </React.Fragment>
  );
};
export default MainPage;
