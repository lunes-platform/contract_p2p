import assets from "../assets"

const calc_fee = (fee_deposit: string) => {
    if(!fee_deposit)
     return 0
    let fee_ = (fee_deposit.split(" ")[0]).replaceAll(".", "").trim()
    return Number(fee_) / 100000000
}
const type_amount_lunes = (value:string) =>{
    if(!value)
        return "LUNES"
    if(value.includes("k"))
        return "LUNES"
    if(value.includes("b"))
        return "BLUNES"
    if(value.includes("m"))
        return "MLUNES"
    else
        return "LUNES"
}
const getPair = (pair: string) => {
    if (!pair)
        return;
    return assets.pair_options.find(e => e.type == pair)
}
const getPairLabel = (pair: string) => {
    if (!pair)
        return;
    return assets.pair_options.find(e => e.type == pair)?.label
}
const getPairType = (pair: string) => {
    if (!pair)
        return;
    return assets.pair_options.find(e => e.type == pair)?.symbol
}
const getAmont = (value: string) => {
    if(!value)
        return;
    return assets.values_type.find(e => e.value == value)
}
const convertTimestamp = (value: string) => {   
    return value.replaceAll(",", "").toString().substring(0, 10)
}
const convertAmountLunes = (value: string) => {
    if(!value)
        return 0
    return Number(value.replaceAll(",", "").toString()) / 100000000
}
const convertAmountCoin = (value: string, pair:string) => {
    if(!value)
        return 0
    let pair_ = getPair(pair)
    return (Number(value.replaceAll(",", "").toString()) / Math.pow(10, Number(pair_?.DECIMAL)))
}

const getTotalPayment = (price:string, amount:string, pair:string) =>{
    let price_ = convertAmountCoin(price,pair)
    let amount_ = convertAmountLunes(amount)
    let tt = price_ * amount_
    
    return tt || 0
}
const validate_address = (address:string, pair:string) =>{
    var isErc20 = getPair(pair)
    if(!isErc20){
        return "invalid pair!"
    }
    if(!address)
        return "invalid pair!"
    var WAValidator = require('litecoin-address-validator');
    console.log('valid :',isErc20.symbol)
    if (isErc20.ERC_20 && (address.substring(0, 2) != "0x" || address.length<40))
        return "Enter Address Erc20 valid!"   
    else if (isErc20.IS_FAMILE_BTC)
        return WAValidator.validate(address, isErc20.symbol)?null:"Enter Address valid!"
    else
        return null;
}

export {calc_fee, type_amount_lunes, getPair,getAmont, convertTimestamp,convertAmountLunes,getTotalPayment,getPairLabel,getPairType,validate_address,convertAmountCoin}