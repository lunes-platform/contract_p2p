use crate::impls::p2p_lunes::data::{BuyBook, Data, InfoContract, LunesError, OrdemBook};
use ink_prelude::vec::Vec;
use openbrush::contracts::{
    ownable, ownable::only_owner, reentrancy_guard, reentrancy_guard::non_reentrant,
};
use openbrush::{
    contracts::traits::psp22::PSP22Error,
    modifiers,
    traits::{AccountId, Balance, Storage, String},
};

#[openbrush::trait_definition]
pub trait P2pLunesImpl:
    Storage<Data> + Storage<reentrancy_guard::Data> + Storage<ownable::Data>
{
    /// Create Order Book
    #[ink(message, payable)]
    #[modifiers(non_reentrant)]
    fn create_order(
        &mut self,
        price: Balance,
        fee: Balance,
        pair: String,
        erc20_address: [u8; 20],
        btc_address: Option<String>,
        info_payment: Option<String>,
    ) -> Result<(), PSP22Error> {
        let mut total_sell = Self::env().transferred_value();
        if total_sell <= self.data::<Data>().min_sales {
            return Err(PSP22Error::Custom(LunesError::BadMintValue.as_str()));
        }
        let owner = self.data::<ownable::Data>().owner.get().unwrap().unwrap();
        //Payment fee p2p2
        Self::env()
            .transfer(owner, fee)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        total_sell = total_sell - fee;

        let date_block = Self::env().block_timestamp();
        let date_expire = date_block + self.data::<Data>().days_expire;
        let caller = Self::env().caller();
        let id = self.data::<Data>().next_order_id;
        self.data::<Data>().books.push(OrdemBook {
            erc20_address: erc20_address,
            date_expire: date_expire,
            date_created: date_block,
            id: id,
            owner: caller,
            pair: pair,
            price: price,
            value: total_sell,
            cencel: false,
            btc_address:btc_address,
            info_payment:info_payment
        });
        self.data::<Data>().next_order_id += 1;
        Ok(())
    }
    /// Cencel Order Book
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn cancel_order(&mut self, id: u64) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
        let index = self
            .data::<Data>()
            .books
            .iter()
            .position(|order| order.id == id && order.owner == caller);
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::ErroCancel.as_str()));
        }
        self.data::<Data>().books[index.unwrap()].cencel = true;
        let value_total = self.data::<Data>().books[index.unwrap()].value;
        Self::env()
            .transfer(caller, value_total)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        self.data::<Data>().books.remove(index.unwrap());
        Ok(())
    }
    /// Create buy order
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn buy_order(&mut self, id: u64, quantity: Balance) -> Result<(), PSP22Error> {
        let index = self
            .data::<Data>()
            .books
            .iter()
            .position(|order| order.id == id && order.cencel == false);
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBook.as_str()));
        }
        let total_orderm = self.data::<Data>().books[index.unwrap()].value;
        if total_orderm < quantity {
            return Err(PSP22Error::Custom(LunesError::BadMintValue.as_str()));
        }
        let caller = Self::env().caller();
        let date_block = Self::env().block_timestamp();
        let date_expire = date_block + 86624000; //1 day
        let next_id = self.data::<Data>().next_buy_id;
        let price = self.data::<Data>().books[index.unwrap()].price;
        let sell_pwner = self.data::<Data>().books[index.unwrap()].owner;
        let info_payment = self.data::<Data>().books[index.unwrap()].info_payment.clone();
        let erc20_address = self.data::<Data>().books[index.unwrap()]
            .erc20_address
            .clone();
        let btc_address = self.data::<Data>().books[index.unwrap()]
        .btc_address
        .clone();
        let pair = self.data::<Data>().books[index.unwrap()].pair.clone();
        self.data::<Data>().books[index.unwrap()].value = total_orderm - quantity;
        self.data::<Data>().buy_books.push(BuyBook {
            conflict: false,
            date_created: date_block,
            id: next_id,
            owner: caller,
            value: quantity,
            price: price,
            date_expire: date_expire,
            receipt: String::from(""),
            sell_owner: sell_pwner,
            erc20_address: erc20_address,
            pair: pair,
            info_payment: info_payment,
            btc_address:btc_address,
            penalty: false,
            confirmed: false,
        });
        if self.data::<Data>().books[index.unwrap()].value <= 0 {
            self.data::<Data>().books.remove(index.unwrap());
        }
        self.data::<Data>().next_buy_id +=1; 
        Ok(())
    }
    /// Confirm sell order
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn confirm_sell(&mut self, id: u64) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
        let index = self.data::<Data>().buy_books.iter().position(|order| {
            order.id == id && order.sell_owner == caller && order.confirmed == false
        });
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }

        let value_total = self.data::<Data>().buy_books[index.unwrap()].value;
        let owner_buy = self.data::<Data>().buy_books[index.unwrap()].owner;

        Self::env()
            .transfer(owner_buy, value_total)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        self.data::<Data>().buy_books[index.unwrap()].confirmed = true;
        Ok(())
    }
    /// Confirm conflit with sale only Contract Owner
    #[ink(message)]
    #[modifiers(non_reentrant)]
    #[openbrush::modifiers(only_owner)]
    fn transfer_conflict_sele(&mut self, id: u64, confirm_payment: bool) -> Result<(), PSP22Error> {
        let date_block = Self::env().block_timestamp();
        let index = self.data::<Data>().buy_books.iter().position(|order| {
            order.id == id
                && order.conflict == true
                && order.date_expire <= date_block
                && order.confirmed == false
        });
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        let mut value_total = self.data::<Data>().buy_books[index.unwrap()].value;
        let value_fee = (value_total * (self.data::<Data>().fee_p2p as u128)) / 100;
        let owner_buy: AccountId;
        let owner_p2p = self.data::<ownable::Data>().owner.get().unwrap().unwrap();
        self.data::<Data>().buy_books[index.unwrap()].confirmed = true;
        if confirm_payment {
            value_total = value_total - value_fee;
            owner_buy = self.data::<Data>().buy_books[index.unwrap()].owner;
            Self::env()
                .transfer(owner_p2p, value_fee)
                .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        } else {
            owner_buy = self.data::<Data>().buy_books[index.unwrap()].sell_owner;
            self.data::<Data>().buy_books[index.unwrap()].penalty = true;
        }

        Self::env()
            .transfer(owner_buy, value_total)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        //self.data::<Data>().buy_books.remove(index.unwrap());

        Ok(())
    }
    /// Open conflict seller
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn open_conflict_seller(&mut self, id: u64) -> Result<(), PSP22Error> {
        let date_block = Self::env().block_timestamp();
        let caller = Self::env().caller();
        let index = self.data::<Data>().buy_books.iter().position(|order| {
            order.id == id
                && order.sell_owner == caller
                && order.confirmed == false
                && order.date_expire <= date_block
        });
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        let is_receipt = self.data::<Data>().buy_books[index.unwrap()]
            .receipt
            .as_str();
        if is_receipt != "" {
            let value_total = self.data::<Data>().buy_books[index.unwrap()].value;
            Self::env()
                .transfer(caller, value_total)
                .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
            self.data::<Data>().buy_books.remove(index.unwrap());
            self.data::<Data>().buy_books[index.unwrap()].penalty = true;
        } else {
            self.data::<Data>().buy_books[index.unwrap()].conflict = true;
        }
        Ok(())
    }
    /// Open conflict user
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn open_conflict_user(&mut self, id: u64) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
        let index =
            self.data::<Data>().buy_books.iter().position(|order| {
                order.id == id && order.owner == caller && order.confirmed == false
            });
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        self.data::<Data>().buy_books[index.unwrap()].conflict = true;
        Ok(())
    }
    /// Send Receipt for payment
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn send_receipt_sell(&mut self, id: u64, receipt: String) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
        let index =
            self.data::<Data>().buy_books.iter().position(|order| {
                order.id == id && order.owner == caller && order.confirmed == false
            });
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        self.data::<Data>().buy_books[index.unwrap()].receipt = receipt;
        Ok(())
    }
    /// Select buy book seller
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn buy_books_seller(&mut self, page: u64) -> Result<Vec<BuyBook>, PSP22Error> {
        if page == 0 {
            return Err(PSP22Error::Custom(LunesError::InvalidPage.as_str()));
        }
        let caller = Self::env().caller();
        let mut _all_buy: Vec<BuyBook> = Vec::new();
        _all_buy = self
            .data::<Data>()
            .buy_books
            .iter()
            .filter(|order| order.sell_owner == caller)
            .cloned()
            .rev()
            .skip(((page - 1) * (100 as u64)).try_into().unwrap())
            .take(100)
            .collect();
        Ok(_all_buy)
    }
    /// buy books user
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn buy_books_user(&mut self, page: u64) -> Result<Vec<BuyBook>, PSP22Error> {
        if page == 0 {
            return Err(PSP22Error::Custom(LunesError::InvalidPage.as_str()));
        }
        let caller = Self::env().caller();
        let mut _all_buy: Vec<BuyBook> = Vec::new();
        _all_buy = self
            .data::<Data>()
            .buy_books
            .iter()
            .filter(|order| order.owner == caller)
            .cloned()
            .rev()
            .skip(((page - 1) * (100 as u64)).try_into().unwrap())
            .take(100)
            .collect();
        Ok(_all_buy)
    }
    /// Close Buy user
    #[ink(message, payable)]
    #[modifiers(non_reentrant)]
    fn close_buy_user(&mut self, id: u64) -> Result<(), PSP22Error> {
        let fee_penalty = Self::env().transferred_value();
        let caller = Self::env().caller();
        let index =
            self.data::<Data>().buy_books.iter().position(|order| {
                order.id == id && order.owner == caller && order.confirmed == false
            });
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        let owner = self.data::<ownable::Data>().owner.get().unwrap().unwrap();
        let balance_order  = self.data::<Data>().buy_books[index].value;
        let owner_order= self.data::<Data>().buy_books[index].sell_owner;
        //Payment owner_order
        Self::env()
            .transfer(owner_order, balance_order)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        //Payment fee p2p2
        Self::env()
            .transfer(owner, fee_penalty)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        self.data::<Data>().buy_books.remove(index.unwrap());
        Ok(())
    }
    /// All books
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn all_books(&mut self, page: u64) -> Result<Vec<OrdemBook>, PSP22Error> {
        if page == 0 {
            return Err(PSP22Error::Custom(LunesError::InvalidPage.as_str()));
        }
        let date_block = Self::env().block_timestamp();
        let mut _all: Vec<OrdemBook> = Vec::new();
        _all = self
            .data::<Data>()
            .books
            .iter()
            .filter(|book| book.cencel == false && book.date_expire > date_block)
            .cloned()
            .rev()
            .skip(((page - 1) * (100 as u64)).try_into().unwrap())
            .take(100)
            .collect();
        _all.sort_by_key(|ordem| ordem.price);
        Ok(_all)
    }
    /// Update fee p2p
    #[ink(message)]
    #[modifiers(non_reentrant)]
    #[openbrush::modifiers(only_owner)]
    fn update_fee(&mut self, fee: u64) -> Result<(), PSP22Error> {
        self.data::<Data>().fee_p2p = fee;
        Ok(())
    }
    /// Update days
    #[ink(message)]
    #[modifiers(non_reentrant)]
    #[openbrush::modifiers(only_owner)]
    fn update_expire_day(&mut self, date_expire: u64) -> Result<(), PSP22Error> {
        self.data::<Data>().days_expire = date_expire;
        Ok(())
    }
    /// Update limite sales
    #[ink(message)]
    #[modifiers(non_reentrant)]
    #[openbrush::modifiers(only_owner)]
    fn update_min_sales(&mut self, min_sales: Balance) -> Result<(), PSP22Error> {
        self.data::<Data>().min_sales = min_sales;
        Ok(())
    }
    #[ink(message)]
    fn info_contract(&mut self) -> Result<InfoContract, PSP22Error> {
        Ok(InfoContract {
            fee_p2p: self.data::<Data>().fee_p2p,
            days_expire: self.data::<Data>().days_expire,
            next_buy_id: self.data::<Data>().next_buy_id,
            next_order_id: self.data::<Data>().next_order_id,
            min_sales: self.data::<Data>().min_sales,
        })
    }
    #[ink(message)]
    fn info_traded24h(&mut self) -> Result<Balance, PSP22Error> {
        let date_block = Self::env().block_timestamp() - 86624000;
        let _all: Vec<BuyBook> = self
            .data::<Data>()
            .buy_books
            .iter()
            .filter(|book| book.date_created > date_block)
            .cloned()
            .collect();
        let soma: Balance = _all.iter().map(|ordem| ordem.value).sum();
        Ok(soma)
    }
    #[ink(message)]
    #[modifiers(non_reentrant)]
    #[openbrush::modifiers(only_owner)]
    fn get_conflict(&mut self, page: u64) -> Result<Vec<BuyBook>, PSP22Error> {
        if page == 0 {
            return Err(PSP22Error::Custom(LunesError::InvalidPage.as_str()));
        }
        let mut _all_buy: Vec<BuyBook> = Vec::new();
        _all_buy = self
            .data::<Data>()
            .buy_books
            .iter()
            .filter(|order| order.conflict == true && order.confirmed == false)
            .cloned()
            .rev()
            .skip(((page - 1) * (100 as u64)).try_into().unwrap())
            .take(100)
            .collect();
        Ok(_all_buy)
    }
    ///Get Payment penalty
    #[ink(message)]
    fn user_penalty(&mut self) -> Result<BuyBook, PSP22Error> {
        let caller = Self::env().caller();
        if let Some(bookby) = self.data::<Data>().buy_books.iter().find(|book| book.penalty && book.owner == caller) {
            Ok(bookby.clone())
        } else {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
    }
    ///Best price
    #[ink(message)]
    fn best_price(&mut self, pair:String, value:Balance) -> Result<Vec<OrdemBook>, PSP22Error> {
        let _menor_preco = self.data::<Data>().books
            .iter()
            .filter(|order| order.pair == pair && order.value >=value)
            .min_by_key(|order| order.price)
            .map(|order| order.price);
        if let Some(menor_preco) = _menor_preco {
            let _menores: Vec<OrdemBook> = self.data::<Data>().books.iter()
                .filter(|order| order.price == menor_preco && order.pair == pair && order.value >=value)
                .rev()
                .cloned()
                .collect();
            return Ok(_menores);
        }
        Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()))
    }
    ///All order owner
    #[ink(message)]
    fn all_order_owner(&mut self, page: u64)-> Result<Vec<OrdemBook>, PSP22Error> {
        if page == 0 {
            return Err(PSP22Error::Custom(LunesError::InvalidPage.as_str()));
        }
        let caller = Self::env().caller();
        let mut _all: Vec<OrdemBook> = Vec::new();
        _all = self
            .data::<Data>()
            .books
            .iter()
            .filter(|book| book.owner == caller)
            .cloned()
            .rev()
            .skip(((page - 1) * (100 as u64)).try_into().unwrap())
            .take(100)
            .collect();
        _all.sort_by_key(|ordem| ordem.price);
        Ok(_all)
    }
     /// Payment penalty
     #[ink(message, payable)]
     #[modifiers(non_reentrant)]
     fn payment_penalty_user(&mut self, id: u64) -> Result<(), PSP22Error> {
         let fee_penalty = Self::env().transferred_value();
         let caller = Self::env().caller();
         let index =
             self.data::<Data>().buy_books.iter().position(|order| {
                 order.id == id && order.owner == caller && order.penalty == true
             });
         if index.is_none() {
             return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
         }
         let owner = self.data::<ownable::Data>().owner.get().unwrap().unwrap();
         
         //Payment fee p2p2
         Self::env()
             .transfer(owner, fee_penalty)
             .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
         self.data::<Data>().buy_books.remove(index.unwrap());
         Ok(())
     }
}
