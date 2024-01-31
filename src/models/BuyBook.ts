class BuyBook {
    public id: number =0
    public value: number =0
    public price: number =0
    public pair: string =""
    public dateExpire: number =0
    public dateCreated: number =0
    public receipt: string =""   
    public sellEmail: string =""   
    public owner: string =""   
    public erc20_address: string =""
    public btc_address: string =""
    public infoPayment: string =""    
    public txidPayment:string = ""
    public penalty: boolean =false
    public confirmed: boolean =false
    public conflict: boolean =false

}
export default new BuyBook()