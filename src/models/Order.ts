class Order {
    public id: number =0
    public value: string =""
    public price: string =""
    public pair: string =""
    public fee: string = ""
    public email: string = ""
    public date_expire: number =0
    public date_created: number =0
    public cencel: boolean =false
    public owner: string =""
    public erc20_address: string =""
    public btc_address: string =""
    public info_payment: string =""
    public decimal: number =0
}   
export default new Order()