import { useContext, useEffect, useState } from "react"
import { ApiContext } from '../context/ApiContext'
import {
  web3Enable,
  web3Accounts,
} from '@polkadot/extension-dapp'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { ApiPromise } from '@polkadot/api'
import { ContractPromise } from '@polkadot/api-contract'
import ABI from '../artifacts/contract_p2p.json'
import InfoModal from "../models/InfoModal";
import InfoExchange from "../models/InfoExchange";

const CONTRACT_ADDRESS: string = process.env.REACT_APP_CONTRACT_ADDRESS || '5DcTWeE9RkzvZEv4m1U4Q2WpQz9jWUP7wuxFQJczU2uWYsEL'

const ContractService = () => {
  const { api, apiReady } = useContext(ApiContext)
  const [error, setError] = useState('')
  const [contract, setContract] = useState<ContractPromise>()
  const [account, setAccount] = useState<InjectedAccountWithMeta>()
  const [loading, setLoading] = useState(false)
  const [contractReady, setContractReady] = useState(false)
  const [infContract, setInfoContract] = useState(InfoModal)
  const [inf24h, setinf24h] = useState(InfoExchange)
  const [allbooks, setAllbooks] = useState([])
  const [balanceLunes, setBalanceLunes] = useState<number>(0)
  useEffect(() => {    
    const getBalance = async () => {
      if (!api || !apiReady || !account) return

      const balanceL: any = await api.query.system.account(account?.address)
      let balance = balanceL.data.free.toNumber() / Math.pow(10, 8)
      setBalanceLunes(balance)
    }

    getBalance()
  }, [api, apiReady, account])
  const getGasLimit = (api: ApiPromise) =>
    api.registry.createType(
      'WeightV2',
      api.consts.system.blockWeights['maxBlock']
    )
  const connectWalletHandler = async () => {
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
  //Info contract
  const infoContractHandler = async () => {

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
      info.valume = dataRest.data.free.toNumber() / Math.pow(10, 8)
      info.trander = trader_amount / Math.pow(10, 8)
      setinf24h(info)
      console.log('info24', info)
    }
  }
  const allBooksHandler = async (page: string) => {
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
      console.log('listall', object)
    }
  }

  return { contract, loading, apiReady, error, account, contractReady, allbooks, infContract, inf24h,balanceLunes, connectWalletHandler, infoContractHandler, infoTraded24hHandler,allBooksHandler }
}
export default ContractService