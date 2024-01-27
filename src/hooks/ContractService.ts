import { useContext, useEffect, useState } from "react"
import {calc_fee, type_amount_lunes} from "../utils/convert"
import { ApiContext } from '../context/ApiContext'
import {
  web3Enable,
  web3Accounts,
  web3FromSource,
} from '@polkadot/extension-dapp'
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

const CONTRACT_ADDRESS: string = process.env.REACT_APP_CONTRACT_ADDRESS || '5DcTWeE9RkzvZEv4m1U4Q2WpQz9jWUP7wuxFQJczU2uWYsEL'

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
  const [inf24h, setinf24h] = useState(InfoExchange)
  const [allbooks, setAllbooks] = useState([])
  const [alltrader, setAllTrader] = useState([])
  const [balanceLunes, setBalanceLunes] = useState<number>(0)
  const [feeNetword, setFeeNetword] = useState<number>(0)
  const [noSuficBalance, setNoSuficBalance] = useState(false)
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  useEffect(() => {
    const getBalance = async () => {
      if (!api || !apiReady || !account) return

      const balanceL: any = await api.query.system.account(account?.address)
      const bal = formatBalance(balanceL.data.free.toBn(), { decimals: 8 }).split(" ")
      let balance = Number(bal[0])
      let have_balance = balance > 1000
      setNoSuficBalance(have_balance)
      setBalanceLunes(balance)
      setLoading(false)
    }

    getBalance()

  }, [api, apiReady, account])
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
      console.log("The user does not have any Substrate wallet installed")
      setError('The user does not have any Substrate wallet installed')
      return
    }
    // set the first wallet as the signer (we assume there is only one wallet)
    api.setSigner(extensions[0].signer)

    const injectedAccounts = await web3Accounts()

    if (injectedAccounts.length > 0) {
      setAccounts(injectedAccounts)
      setAccount(injectedAccounts[0])
    }
    console.log(injectedAccounts[0]);
    conectcontract()
  }
  const conectcontract = () => {
    const contract = new ContractPromise(api, ABI, CONTRACT_ADDRESS);
    setContract(contract)
    console.log("contract", contract)
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
      console.log('info', info)
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
      setinf24h(info)
      console.log('info24',info)
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
      console.log('setAllbooks', object)
    }
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
      console.log('allOrderOwnerHandler', output.toHuman())
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
      console.log('bestPriceHandler', object)
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
      console.log('setOrderPenalty', object)
    }
  }
  const feeNwtWorkOrderHandler = async (price_: string, fee: string, pair: string, erc20Address: string, btcAddress: string, infoPayment: string, amount: string) => {
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
      const price = Number(price_.replaceAll(".", "").replaceAll(",", "").trim()) * 100000000
      const gasLimit: any = getGasLimit(api)
      console.log("amount_price", price)
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
        infoPayment
      )

      console.log('feeNwtWorkOrder', storageDeposit.toHuman().Charge)
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
    } catch (e) {
      console.log(e)
    }

  }


  const createOrderHandler = async (price_: string, fee: string, pair: string, erc20Address: string, btcAddress: string, infoPayment: string, amount: string) => {
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

    const price = Number(price_.replaceAll(".", "").replaceAll(",", "").trim()) * 100000000
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
        infoPayment
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
        infoPayment)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
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
      console.log('buyBooksSeller', object)
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

    console.log('feeConfirmSellHandler', storageDeposit.toHuman().Charge)
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

  const confirmSellHandler = async (id: string) => {
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
      await contract.tx['p2pLunesImpl::confirmSell']({
        gasLimit,
        storageDepositLimit: null
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setLoading(false)
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }

  }
  const feeBuyOrderHandler = async (id: string, quantity: number) => {
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
    const { storageDeposit, result }: any = await contract.query['p2pLunesImpl::buyOrder'](
      account.address,
      {
        gasLimit,
        storageDepositLimit: null
      },
      id,
      quantity
    )

    console.log('feeBuyOrderHandler', storageDeposit.toHuman().Charge)
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
    setFeeNetword(storageDeposit.toHuman().Charge)
  }

  const buyOrderHandler = async (id: string, quantity: number) => {
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
      await contract.tx['p2pLunesImpl::buyOrder']({
        gasLimit,
        storageDepositLimit: null
      },
        id,
        quantity)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setLoading(false)
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

  const sendReceiptSellHandler = async (id: string, receipt: string) => {
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
      await contract.tx['p2pLunesImpl::receipt']({
        gasLimit,
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
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }
  const feeOpenConflictSeller = async (id: string) => {
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
  const openConflictSeller = async (id: string) => {
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
      await contract.tx['p2pLunesImpl::openConflictSeller']({
        gasLimit,
        storageDepositLimit: null
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setLoading(false)
          }
        })
    } catch {
      setError("Erro Trasaction")
      setLoading(false)
    }
  }

  const feeCancelOrderSeller = async (id: string, amount: number) => {
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
        storageDepositLimit: null,
        value: (new BN(amount)).mul(decimals)
      },
      id
    )

    console.log('feeCancelOrderSeller', storageDeposit.toHuman().Charge)
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
  const cancelOrderSeller = async (id: string, amount: number) => {
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
      await contract.tx['p2pLunesImpl::cancelOrder']({
        gasLimit,
        storageDepositLimit: null,
        value: (new BN(amount)).mul(decimals)
      },
        id)
        .signAndSend(account.address, (res) => {
          if (res.status.isInBlock) {
            console.log('in a block')
          }
          if (res.status.isFinalized) {
            setLoading(false)
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
    noSuficBalance,
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
    feeOpenConflictSeller,
    openConflictSeller,
    feeCancelOrderSeller,
    cancelOrderSeller,
    setLoading,
    handleOnSelect,
    accounts
  }
}
export default ContractService