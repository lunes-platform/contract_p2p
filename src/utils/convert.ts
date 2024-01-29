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
    return assets.pair_options.find(e => e.type == pair)?.type
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
const getTotalPayment = (price:string, amount:string) =>{
    let price_ = convertAmountLunes(price)
    let amount_ = convertAmountLunes(amount)
    let tt = price_ * amount_
    
    return tt || 0
}
export {calc_fee, type_amount_lunes, getPair,getAmont, convertTimestamp,convertAmountLunes,getTotalPayment,getPairLabel,getPairType}