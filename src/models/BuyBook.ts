class BuyBook {
    public id: number =0
    public value: number =0
    public price: number =0
    public pair: string =""
    public date_expire: number =0
    public date_created: number =0
    public receipt: string =""   
    public sell_owner: string =""   
    public owner: string =""   
    public erc20_address: string =""
    public btc_address: string =""
    public info_payment: string =""    
    public penalty: boolean =false
    public confirmed: boolean =false
    public conflict: boolean =false

}
export default new BuyBook()