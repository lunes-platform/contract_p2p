import { useContext, useEffect, useState } from "react"
import {calc_fee, convertAmountLunes, type_amount_lunes} from "../utils/convert"
import { ApiContext } from '../context/ApiContext'
import {
  web3Enable,
  web3Accounts,
  web3FromSource,
} from '@polkadot/extension-dapp'
import {send_email, message_buy, message_receipt, mensagem_deposit, open_conflit_p2p} from '../utils/sendEmail'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { ApiPromise } from '@polkadot/api'
import { ContractPromise } from '@polkadot/api-contract'
import ABI from '../artifacts/contract_p2p.json'
import InfoModal from "../models/InfoModal";
import InfoExchange from "../models/InfoExchange";
import BuyBook from "../models/BuyBook"
import { BN } from '@polkadot/util/bn'
import { formatBalance } from '@polkadot/util';
const decimals = new BN('100000000')
const EMAIL_CONFLIT:string = process.env.REACT_APP_EMAIL_FIN || ""
const CONTRACT_ADDRESS: string = process.env.REACT_APP_CONTRACT_ADDRESS || '5G3VfP36indbUdwLqPggkdbyfJfZg5ZpKyiT3HuD4Wg6tyzG'
var is_ready = false;
const ContractService = () => {
  const { api, apiReady } = useContext(ApiContext)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [contract, setContract] = useState<ContractPromise>()
  const [account, setAccount] = useState<InjectedAccountWithMeta>()
  const [loading, setLoading] = useState(true)
  const [contractReady, setContractReady] = useState(false)
  const [infContract, setInfoContract] = useState(InfoModal)
  const [orderPenalty, setOrderPenalty] = useState(BuyBook) 
  const [inf24h, setinf24h] = useState({})
  const [allbooks, setAllbooks] = useState([])
  const [alltrader, setAllTrader] = useState([])
  const [balanceLunes, setBalanceLunes] = useState<string>("")
  const [feeNetword, setFeeNetword] = useState<number>(0)
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [ownerContract, setOwnerContract] = useState<string>("")
  useEffect(() => {
    getBalance()
    listenContract()
    getOwnerContracthHandler()
  }, [api, apiReady, account])
  const getBalance = async () => {
    if (!api || !apiReady || !account) return
    console.log("ades contract", process.env.REACT_APP_CONTRACT_ADDRESS)
    const balanceL: any = await api.query.system.account(account?.address)
    const balance_fee = convertAmountLunes(balanceL.data.free.toHuman()) - convertAmountLunes(balanceL.data.feeFrozen.toHuman())
    setBalanceLunes(balance_fee.toString())
    setLoading(false)      
  }
  const getUserNewBalance = async () =>{
    if (!api || !apiReady) {
      return
    }
    const injectedAccounts = await web3Accounts()
    let user = account;
    if (injectedAccounts.length > 0) {
      injectedAccounts.forEach(async (el)=>{
        if(user?.address == el.address){
          setAccount(el)
          const balanceL: any = await api.query.system.account(el?.address)
          const balance_fee = convertAmountLunes(balanceL.data.free.toHuman()) - convertAmountLunes(balanceL.data.feeFrozen.toHuman())
          setBalanceLunes(balance_fee.toString())
        }
      });
      setAccounts(injectedAccounts)
      
    }
  }
  const listenContract = () =>{
    if (!api || !apiReady) {
      return
    }
   
    api.query.system.events((events:any) => {
      events.forEach((record:any) => {
          const { event } = record;
          
          console.log('phase detectado:', event.section );
          if (event.section === 'seuContrato' && event.method === 'SeuEvento') {
              console.log('Evento detectado:', event.data.toString());
          }
          if (event.section === 'balances' && event.method === 'Transfer') {
            if( event.data.toHuman().to == account?.address || event.data.toHuman().from == account?.address){              
              getUserNewBalance()             
            }
            
          }
          if(event.section == 'transactionPayment'){
            loadingContract()
          }
          
      });
  })
  
  }
  const loadingContract = async () =>{
    if(!is_ready){
      //is_ready = true;
      await infoTraded24hHandler()
      await allBooksHandler("1")   
     // is_ready = false;
      console.log("is_ready", is_ready)

    }
  }
  useEffect(() => {
    if (apiReady)
      setLoading(false)
  }, [apiReady])
  const getGasLimit = (api: ApiPromise) =>
    api.registry.createType(
      'WeightV2',
      api.consts.system.blockWeights['maxBlock']
    )
  const connectWalletHandler = async () => {
    setLoading(true)
    setError('')
    if (!api || !apiReady) {
      return
    }
    const extensions = await web3Enable('Lunes NFT')

    /* check if wallet is installed */
    if (extensions.length === 0) {
      setError('The user does not have any Substrate wallet installed')
      setLoading(false)      
      return
    }
    // set the first wallet as the signer (we assume there is only one wallet)
    api.setSigner(extensions[0].signer)

    const injectedAccounts = await web3Accounts()

    if (injectedAccounts.length > 0) {
      setAccounts(injectedAccounts)
      setAccount(injectedAccounts[0])
    }
    conectcontract()
  }
  const conectcontract = () => {
    const contract = new ContractPromise(api, ABI, CONTRACT_ADDRESS);
    setContract(contract)
  }
  const handleOnSelect = async (event: any) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return false
    }
    const address: string = event.target.value
    const account = accounts.find(account => account.address === address)
    if (account) {
      setAccount(account)

      const injected = await web3FromSource(account.meta.source)
      api.setSigner(injected.signer)
      conectcontract()
    }
  }
  //Info contract
  const infoContractHandler = async () => {

    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)

    const { result, output }: any = await contract.query['p2pLunesImpl::infoContract'](
      account.address,
      {
        gasLimit,
      }
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      const info = InfoModal;
      const timeContract = Number(object.daysExpire.toString().replaceAll(',', '').trim())
      info.daysExpire = Date.now() + timeContract
      info.feeP2p = Number(object.feeP2p)
      info.nextBuyId = Number(object.nextBuyId)
      info.nextOrderId = Number(object.nextOrderId)
      info.minSales = Number(object.minSales.toString().replaceAll(',', '').trim())
      setInfoContract(info)
      setContractReady(true)
    }

  }
  const infoTraded24hHandler = async () => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)
   
    const { result, output }: any = await contract.query['p2pLunesImpl::infoTraded24h'](
      account.address,
      {
        gasLimit,
      }
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      const info = InfoExchange;
      const trader_amount = Number(object.toString().replaceAll(',', '').trim())
      const dataRest: any = await api.query.system.account(CONTRACT_ADDRESS);
      const bal = formatBalance(dataRest.data.free.toBn(), { decimals: 8 }).split(" ")
      info.valume = bal[0] +" "+type_amount_lunes(bal[1])
      info.trander = trader_amount / 100000000
      console.log("infoTraded24hHandler",info)
      setinf24h(info)
    }
  }
  const allBooksHandler = async (page: string) => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)

    const { result, output }: any = await contract.query['p2pLunesImpl::allBooks'](
      account.address,
      {
        gasLimit,
      },
      page
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      setAllbooks(object);
    }
    await setEventOrderhHandler()
  }

  const allOrderOwnerHandler = async (page: string) => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)

    const { result, output }: any = await contract.query['p2pLunesImpl::allOrderOwner'](
      account.address,
      {
        gasLimit,
      },
      page
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      setAllbooks(object || []);
    }
  }
  const bestPriceHandler = async (pair: string, value: number) => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)

    const { result, output }: any = await contract.query['p2pLunesImpl::bestPrice'](
      account.address,
      {
        gasLimit,
      },
      pair,
      value
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      setAllbooks(object);
    }
  }

  const userPenaltyHandler = async () => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)

    const { result, output }: any = await contract.query['p2pLunesImpl::userPenalty'](
      account.address,
      {
        gasLimit,
      }
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      setOrderPenalty(object);
    }
  }
  const feeNwtWorkOrderHandler = async (price_: string, fee: string, pair: string, erc20Address: string, btcAddress: string, infoPayment: string, amount: string, email:string) => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    try {
      const price = Number(price_) * 10000000000
      const gasLimit: any = getGasLimit(api)
      //Estimativa do gas 
      const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::createOrder'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null,
          value: (new BN(amount)).mul(decimals)
        },
        price.toString(),
        fee,
        pair,
        erc20Address,
        btcAddress,
        infoPayment,
        email
      )

      console.log('feeNwtWorkOrder', storageDeposit.toHuman().Charge)
      if (result.isErr) {
        let error = ""
        setError("");
        if (result.asErr.isModule) {          
          const dispatchError = api.registry.findMetaError(result.asErr.asModule)
          setFeeNetword(0)
          error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
        } else {
          error = result.asErr.toString()
        }
        setError(error)
        return
      }

      let fee_ = calc_fee(storageDeposit.toHuman().Charge)
      setFeeNetword(fee_)
    } catch (e) {
      setFeeNetword(0)
      console.log(e)
    }

  }

  
  const createOrderHandler = async  (price_: string, fee: string, pair: string, erc20Address: string, btcAddress: string, infoPayment: string, amount: string, email:string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }

    const price = Number(price_) * 10000000000
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      //Estimativa do gas 
      const { gasRequired }: any = await contract.query['p2pLunesImpl::createOrder'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null,
          value: (new BN(amount)).mul(decimals)
        },
        price.toString(),
        fee,
        pair,
        erc20Address,
        btcAddress,
        infoPayment,
        email
      )

      await contract.tx['p2pLunesImpl::createOrder']({
        gasLimit: gasRequired,
        storageDepositLimit: null,
        value: (new BN(amount)).mul(decimals)
      },
        price,
        fee,
        pair,
        erc20Address,
        btcAddress,
        infoPayment,
        email)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setError("")  
            setSuccessMsg("")           
            setSuccessMsg('Successfully creted order!')
            infoTraded24hHandler()
            allOrderOwnerHandler("1")
            setLoading(false)
            
          }
        })
    } catch (e) {
      console.log(e)
      setError("Erro Trasaction")
      setLoading(false)
    }

  }

  const buyBooksSellerHandler = async (page: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    const gasLimit: any = getGasLimit(api)

    const { result, output }: any = await contract.query['p2pLunesImpl::buyBooksSeller'](
      account.address,
      {
        gasLimit,
      },
      page
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      setAllTrader(object);
    }
  }
  const buyBooksUserHandler = async (page: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    const gasLimit: any = getGasLimit(api)

    const { result, output }: any = await contract.query['p2pLunesImpl::buyBooksUser'](
      account.address,
      {
        gasLimit,
      },
      page
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      setAllTrader(object);
      console.log('buyBooksSeller', object)
    }
  }

  const feeConfirmSellHandler = async (id: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }

    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::confirmSell'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id
    )

    console.log('feeConfirmSellHandler', storageDeposit.toHuman())
    if (result.isErr) {
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        setFeeNetword(0)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Charge)
    console.log(fee_)
    setFeeNetword(fee_)
  }

  const confirmSellHandler = async (id: string,email_to:string, value:string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const { gasRequired }: any = await contract.query['p2pLunesImpl::confirmSell'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null
        },
        id
      )
      await contract.tx['p2pLunesImpl::confirmSell']({
        gasLimit:gasRequired,
        storageDepositLimit: null
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setLoading(false)
            infoTraded24hHandler()
            buyBooksSellerHandler("1")
            setLoading(false)
            setError("")
            setSuccessMsg("")           
            setSuccessMsg('Successfully payment!')
            let txid = res.status.hash.toJSON(); 
            send_email(email_to,"Deposit Notification:"+id, mensagem_deposit(convertAmountLunes(value).toString(),txid,id))
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }

  }
  const feeBuyOrderHandler = async (id: string, quantity: string,email:string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    console.log("veio",quantity)
    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::buyOrder'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id,
      quantity,
      email
    )

    console.log('feeBuyOrderHandler', storageDeposit.toHuman())
    if (result.isErr) {
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Charge)
    console.log(fee_)
    setFeeNetword(fee_)
  }

  const buyOrderHandler = async (id: string, quantity: string,email:string,email_sell:string, price_total:string, pair:string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const { gasRequired }: any = await contract.query['p2pLunesImpl::buyOrder'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null
        },
        id,
        quantity,
        email
      )
      await contract.tx['p2pLunesImpl::buyOrder']({
        gasLimit:gasRequired,
        storageDepositLimit: null
      },
        id,
        quantity,
        email)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setError("");
            setSuccessMsg("")           
            setSuccessMsg('Successfully creted order!')
            infoTraded24hHandler()
            buyBooksUserHandler("1")
            setLoading(false)
            send_email(email_sell,"Confirmation of P2P Sales Cryptocurrency Transaction", message_buy(convertAmountLunes(quantity).toString(),price_total,pair))
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }

  const feeReceiptSellHandler = async (id: string, receipt: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }

    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::sendReceiptSell'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id,
      receipt
    )

    console.log('feeReceiptSellHandler', storageDeposit.toHuman())
    if (result.isErr) {
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Charge)
    console.log(fee_)
    setFeeNetword(fee_)
  }

  const sendReceiptSellHandler = async (id: string, receipt: string, email_sell:string, pair:string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const { gasRequired }: any = await contract.query['p2pLunesImpl::sendReceiptSell'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null
        },
        id,
        receipt
      )
  
      await contract.tx['p2pLunesImpl::sendReceiptSell']({
        gasLimit:gasRequired,
        storageDepositLimit: null
      },
        id,
        receipt)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setLoading(false)
            setError("");
            setSuccessMsg("")           
            setSuccessMsg('Successfully sender receipt!')
            send_email(email_sell,"Confirmation of  Receipt Cryptocurrency ID:"+id, message_receipt(id,receipt,pair))
            buyBooksUserHandler("1")
          }
        })
    } catch(e) {
      console.log(e)
      setError("Erro Trasaction")
      setLoading(false)
    }
  }
  const feeOpenConflictSellerHandler  = async (id: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }

    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::openConflictSeller'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id
    )

    console.log('feeOpenConflictSeller', storageDeposit.toHuman().Charge)
    if (result.isErr) {
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Charge)
    console.log(fee_)
    setFeeNetword(fee_)
  }
  const openConflictSellerHandler  = async (id: string, date_expire:string, value:string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const { gasRequired }: any = await contract.query['p2pLunesImpl::openConflictSeller'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null
        },
        id
      )
      await contract.tx['p2pLunesImpl::openConflictSeller']({
        gasLimit:gasRequired,
        storageDepositLimit: null
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            infoTraded24hHandler()
            buyBooksSellerHandler("1")
            setLoading(false)
            setError("")
            setSuccessMsg("")           
            setSuccessMsg('Successfully open Dispute/Conflict!')
            send_email(EMAIL_CONFLIT,"Conflit OTC", open_conflit_p2p(id,date_expire, value))
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }
  const feeOpenConflictUserHandler  = async (id: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }

    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::openConflictUser'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id
    )

    console.log('openConflictUser', storageDeposit.toHuman().Charge)
    if (result.isErr) {
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Charge)
    console.log(fee_)
    setFeeNetword(fee_)
  }
  const openConflictUserHandler  = async (id: string,date_expire:string, value:string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const { gasRequired }: any = await contract.query['p2pLunesImpl::openConflictUser'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null
        },
        id
      )
      await contract.tx['p2pLunesImpl::openConflictUser']({
        gasLimit:gasRequired,
        storageDepositLimit: null
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            infoTraded24hHandler()
            buyBooksUserHandler("1")
            setLoading(false)
            setError("")
            setSuccessMsg("")           
            setSuccessMsg('Successfully open Dispute/Conflict!')
            send_email(EMAIL_CONFLIT,"Conflit OTC", open_conflit_p2p(id,date_expire, value))
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }
  const feeCancelOrderSellerHandler  = async (id: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }

    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::cancelOrder'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id
    )

    console.log('feeCancelOrderSeller', storageDeposit.toHuman().Refund)
    console.log('feeCancelOrderSeller1', result.isErr)
    if (result.isErr) {
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        setFeeNetword(0)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Refund)
    console.log(fee_)
    setFeeNetword(fee_)
  }
  const cancelOrderSellerHandler  = async (id: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }
    setError("")
    setSuccessMsg("")     
    if (!contract) {
      setError('Contract not initialized')
      return
    }
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const { gasRequired }: any = await contract.query['p2pLunesImpl::cancelOrder'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null
        },
        id
      )
      await contract.tx['p2pLunesImpl::cancelOrder']({
        gasLimit:gasRequired,
        storageDepositLimit: null
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {            
            infoTraded24hHandler()
            allOrderOwnerHandler("1")
            setLoading(false)
                 
            setSuccessMsg('Successfully cancel order!')
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }
  const feeCloseBuyUserHandler  = async (id: string, amount: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
   
    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::closeBuyUser'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null,
        value: (new BN(amount)).mul(decimals)
      },
      id
    )
   
    console.log('closeBuyUser', storageDeposit.toHuman().Refund)
    if (result.isErr) {
      setError('')
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        setFeeNetword(0)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Refund)
    console.log(fee_)
    setFeeNetword(fee_)
  }
  const closeBuyUserHandler  = async (id: string, amount: string) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
    console.log("paynenety", amount)
    console.log("paynenety", id)
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const {gasRequired }: any = await contract.query['p2pLunesImpl::closeBuyUser'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null,
          value: (new BN(amount)).mul(decimals)
        },
        id
      )  
      await contract.tx['p2pLunesImpl::closeBuyUser']({
        gasLimit:gasRequired,
        storageDepositLimit: null,
        value: (new BN(amount)).mul(decimals)
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            infoTraded24hHandler()
            buyBooksUserHandler("1")
            setLoading(false)
            setError("")
            setSuccessMsg("")           
            setSuccessMsg('Successfully cancel order!')
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }
  const setEventOrderhHandler = async () => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)
   
    const { result, output }: any = await contract.query['setEnventOrder'](
      account.address,
      {
        gasLimit,
      },
      1
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman()
      
      console.log("setEventOrderhHandler",object)
    }
  }
  const getOwnerContracthHandler = async () => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    const gasLimit: any = getGasLimit(api)
   
    const { result, output }: any = await contract.query['ownable::owner'](
      account.address,
      {
        gasLimit,
      }
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman()
      setOwnerContract(object.Ok)
      console.log("ownable::owner",object)
    }
  }
  const allOrderWithConflitHandler = async (page: string) => {
    if (!api || !apiReady) {
      return
    }
    if (!account) {
      return
    }

    if (!contract) {
      return
    }
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    
    const { result, output }: any = await contract.query['p2pLunesImpl::getConflict'](
      account.address,
      {
        gasLimit,
      },
      page
    )
    if (result.isErr) {
      setError(result.isErr)
    }
    if (output && !result.isErr) {
      const object = output.toHuman().Ok?.Ok
      console.log('p2pLunesImpl::getConflict',object)
      setAllbooks(object || []);
    }
    setLoading(false)
  }
  const feeTransferConflictSeleHandler  = async (id: string, confirmPayment:boolean) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }

    const gasLimit: any = getGasLimit(api)
    //Estimativa do gas 
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::transferConflictSele'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id,
      confirmPayment
    )

    console.log('transferConflictSele', storageDeposit.toHuman().Charge)
    console.log('transferConflictSele', result.isErr)
    if (result.isErr) {
      let error = ''
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        console.log('error', dispatchError.name)
        setFeeNetword(0)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
      setError(error)
      return
    }
    let fee_ = calc_fee(storageDeposit.toHuman().Charge)
    console.log(fee_)
    setFeeNetword(fee_)
  }
  const transferConflictSeleHandler  = async (id: string, confirmPayment:boolean) => {
    if (!api || !apiReady) {
      setError('The API is not ready')
      return
    }
    if (!account) {
      setError('Account not initialized')
      return
    }

    if (!contract) {
      setError('Contract not initialized')
      return
    }
   
    setLoading(true)
    const gasLimit: any = getGasLimit(api)
    try {
      const { gasRequired }: any = await contract.query['p2pLunesImpl::transferConflictSele'](
        account.address,
        {
          gasLimit,
          storageDepositLimit: null
        },
        id,
        confirmPayment
      )
      await contract.tx['p2pLunesImpl::transferConflictSele']({
        gasLimit:gasRequired,
        storageDepositLimit: null,
      },
        id,
        confirmPayment)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            infoTraded24hHandler()
            allOrderWithConflitHandler("1")
            setLoading(false)
            setError("")
            setSuccessMsg("")           
            setSuccessMsg('Successfully cancel order!')
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }
  return {
    contract,
    loading,
    apiReady,
    error,
    account,
    contractReady,
    allbooks,
    infContract,
    inf24h,
    balanceLunes,
    feeNetword,
    orderPenalty,
    alltrader,
    successMsg,
    connectWalletHandler,
    infoContractHandler,
    infoTraded24hHandler,
    allBooksHandler,
    allOrderOwnerHandler,
    userPenaltyHandler,
    feeNwtWorkOrderHandler,
    createOrderHandler,
    buyBooksSellerHandler,
    buyBooksUserHandler,
    feeConfirmSellHandler,
    confirmSellHandler,
    feeBuyOrderHandler,
    buyOrderHandler,
    sendReceiptSellHandler,
    feeReceiptSellHandler,
    bestPriceHandler,
    feeOpenConflictSellerHandler ,
    openConflictSellerHandler ,
    feeCancelOrderSellerHandler ,
    cancelOrderSellerHandler ,
    feeCloseBuyUserHandler,
    closeBuyUserHandler,
    openConflictUserHandler,
    feeOpenConflictUserHandler,
    setLoading,
    handleOnSelect,
    accounts,
    setEventOrderhHandler,
    ownerContract,
    allOrderWithConflitHandler,
    transferConflictSeleHandler,
    feeTransferConflictSeleHandler
  }
}
export default ContractService