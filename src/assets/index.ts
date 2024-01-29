const pair_options = [
    { label: 'PIX:BRAZIL', type: 'PIX:PIX',DECIMAL:2, ERC_20:false,explorer:"",explorerTest:"" },
    { label: 'DOLAR USDT/BNB', type: 'USDT:BNB', DECIMAL:18, ERC_20:true,explorer:"https://bscscan.com/tx/",explorerTest:"https://testnet.bscscan.com/tx/" },
    { label: 'DOLA USDT/ETH', type: 'USDT:ETH',DECIMAL:18, ERC_20:true,explorer:"https://etherscan.io/tx/",explorerTest:"https://goerli.etherscan.io/tx/" },
    { label: 'DOLAR DAI/ETH', type: 'DAI:ETH',DECIMAL:18, ERC_20:true,explorer:"https://etherscan.io/tx/",explorerTest:"https://goerli.etherscan.io/tx/" },
    { label: 'DOLAR DAI/BNB', type: 'DAI/BNB',DECIMAL:18, ERC_20:true,explorer:"https://bscscan.com/tx/",explorerTest:"https://testnet.bscscan.com/tx/" },    
    { label: 'BITCOIN', type: 'BTC:BTC',DECIMAL:8, ERC_20:false,explorer:"https://live.blockcypher.com/btc/tx/",explorerTest:"https://live.blockcypher.com/btc-testnet/tx/" },
    { label: 'LITECOIN', type: 'LITECOIN:LITECOIN',DECIMAL:8, ERC_20:false,explorer:"https://live.blockcypher.com/ltc/tx/",explorerTest:"https://live.blockcypher.com/ltc-textnet/tx/" },
    { label: 'DASH', type: 'DASH:DASH',DECIMAL:8, ERC_20:false,explorer:"https://live.blockcypher.com/dash/tx/",explorerTest:"https://live.blockcypher.com/dash-testnet/tx/" },
    { label: 'DOGCOIN', type: 'DOGCOIN:DOGCOIN',DECIMAL:8, ERC_20:false,explorer:"https://live.blockcypher.com/doge/tx/",explorerTest:"https://live.blockcypher.com/doge-testnet/tx/" },
    { label: 'ETHERIUM/BNB', type: 'ETH:BNB',DECIMAL:18, ERC_20:true,explorer:"https://bscscan.com/tx/",explorerTest:"https://testnet.bscscan.com/tx/" },
    { label: 'ETHERIUM', type: 'ETH:ETH',DECIMAL:18, ERC_20:true,explorer:"https://etherscan.io/tx/",explorerTest:"https://goerli.etherscan.io/tx/" },    
    { label: 'SOLANA/ETH ', type: 'SOL:ETH',DECIMAL:18, ERC_20:true,explorer:"",explorerTest:"" },
    { label: 'GMC/BNB ', type: 'GMC:BNB',DECIMAL:18, ERC_20:true,explorer:"https://bscscan.com/tx/",explorerTest:"https://testnet.bscscan.com/tx/" },
];

const values_type =[
    { label: '1000 LUNES', value: "1000" },
    { label: '5000 LUNES', value: "5000" },
    { label: '10000 LUNES', value: "10000" },
    { label: '15000 LUNES', value: "15000" },
    { label: '20000 LUNES', value: "20000" },
    { label: '30000 LUNES', value: "30000" },
    { label: '40000 LUNES', value: "40000" },
    { label: '50000 LUNES', value: "50000" },
    { label: '500000 LUNES', value: "500000" },
]
export default {pair_options, values_type}