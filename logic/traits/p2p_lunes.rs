
use openbrush::traits::{Balance, String};

#[openbrush::wrapper]
pub type P2pLunesImplRef = dyn P2pLunesImplLunes;

#[openbrush::trait_definition]
pub trait P2pLunesImplLunes {
    #[ink(message, payable)]
    fn create_order(
        &mut self,
        price: Balance,
        fee:Balance,
        pair: String,
        address_payment: String,
        email:String
    ) -> Result<(), ()>;
    #[ink(message)]
    fn cancel_order(&mut self, id: u64,  email:String) -> Result<(), ()>;
    #[ink(message)]
    fn buy_order(&mut self, id: u64, quantity: Balance) -> Result<(), ()>;
    #[ink(message)]
    fn confirm_sell(&mut self, id: u64) -> Result<(), ()>;
    #[ink(message)]
    fn transfer_conflict_sele(&mut self, id: u64, confirm_payment: bool) -> Result<(), ()>;
    #[ink(message)]
    fn open_conflict_seller(&mut self, id: u64) -> Result<(), ()>;
    #[ink(message)]
    fn open_conflict_user(&mut self, id: u64) -> Result<(), ()>;
    #[ink(message)]
    fn send_receipt_sell(&mut self, id: u64, receipt: String) -> Result<(), ()>;
    #[ink(message)]
    fn buy_books_seller(&mut self, page: u64) -> Result<(), ()>;
    #[ink(message)]
    fn buy_books_user(&mut self, page: u64) -> Result<(), ()>;
    #[ink(message,payable)]
    fn close_buy_user(&mut self, id: u64) -> Result<(), ()>;
    #[ink(message)]
    fn all_books(&mut self, page: u64) -> Result<(), ()>;
    #[ink(message)]
    fn update_fee(&mut self, fee:u64) -> Result<(), ()>;
    #[ink(message)]
    fn update_expire_day(&mut self, date_expire:u64) -> Result<(), ()>;
    #[ink(message)]
    fn update_min_sales(&mut self, min_sales:Balance) -> Result<(), ()>;
    #[ink(message)]
    fn info_contract(&mut self)-> Result<(), ()>;
    #[ink(message)]
    fn info_traded24h(&mut self)-> Result<(), ()>;
    #[ink(message)]
    fn get_conflict(&mut self,page: u64)-> Result<(), ()>;
    #[ink(message)]
    fn user_penalty(&mut self)-> Result<(), ()>;
    #[ink(message)]
    fn best_price(&mut self, pair:String, value:Balance)->   Result<(), ()>;
    #[ink(message)]
    fn all_order_owner(&mut self, page: u64) -> Result<(), ()>;
    #[ink(message, payable)]
    fn payment_penalty_user(&mut self, id: u64) -> Result<(), ()>;
    #[ink(message)]
    fn register_txid(&mut self, id: u64, txid:[u8; 32]) -> Result<(), ()>;
    
}
