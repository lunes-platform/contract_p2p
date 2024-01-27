const calc_fee = (fee_deposit: string) => {
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

export {calc_fee, type_amount_lunes}