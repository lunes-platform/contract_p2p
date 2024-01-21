use crate::impls::p2p_lunes::data::{ Data, BuyBook, OrdemBook,InfoContract, LunesError };
use openbrush::{
    modifiers,
    traits::{ AccountId, Balance, Storage, String },
    contracts::traits::psp22::PSP22Error,
};
use ink_prelude::vec::Vec;
use openbrush::contracts::{
    ownable,
    ownable::only_owner,
    reentrancy_guard,
    reentrancy_guard::non_reentrant,
};

#[openbrush::trait_definition]
pub trait P2pLunesImpl: Storage<Data> + Storage<reentrancy_guard::Data> + Storage<ownable::Data> {
    /// Create Order Book
    #[ink(message, payable)]
    #[modifiers(non_reentrant)]
    fn create_order(
        &mut self,
        price: Balance,
        pair: String,
        address_payment: String
    ) -> Result<(), PSP22Error> {
        let mut total_sell = Self::env().transferred_value();
        if total_sell <= self.data::<Data>().min_sales {
            return Err(PSP22Error::Custom(LunesError::BadMintValue.as_str()));
        }
        let feepay = (total_sell * (self.data::<Data>().fee_p2p as u128)) / 100;
        let owner = self.data::<ownable::Data>().owner.get().unwrap().unwrap();
        //Payment fee p2p2
        Self::env()
            .transfer(owner, feepay)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        total_sell = total_sell - feepay;

        let date_block = Self::env().block_timestamp();
        let date_expire = date_block + self.data::<Data>().days_expire;
        let caller = Self::env().caller();
        let id = self.data::<Data>().next_order_id;
        self.data::<Data>().books.push(OrdemBook {
            address_payment: address_payment,
            date_expire: date_expire,
            date_created: date_block,
            id: id,
            owner: caller,
            pair: pair,
            price: price,
            value: total_sell,
            cencel: false,
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
            .books.iter()
            .position(|order| order.id == id && order.owner == caller && order.cencel == false);
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
            .books.iter()
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
        let address_payment = self.data::<Data>().books[index.unwrap()].address_payment.clone();
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
            address_payment: address_payment,
            pair: pair,
            confirmed: false,
        });
        if self.data::<Data>().books[index.unwrap()].value <= 0 {
            self.data::<Data>().books.remove(index.unwrap());
        }
        Ok(())
    }
    /// Confirm sell order
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn confirm_sell(&mut self, id: u64) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
        let index = self
            .data::<Data>()
            .buy_books.iter()
            .position(
                |order| order.id == id && order.sell_owner == caller && order.confirmed == false
            );
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
        let index = self
            .data::<Data>()
            .buy_books.iter()
            .position(
                |order| order.id == id && order.conflict == true && order.date_expire <= date_block
            );
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        let mut value_total = self.data::<Data>().buy_books[index.unwrap()].value;
        let value_fee = (value_total * (self.data::<Data>().fee_p2p as u128)) / 100;
        let owner_buy: AccountId;
        let owner_p2p = self.data::<ownable::Data>().owner.get().unwrap().unwrap();
        if confirm_payment {
            value_total = value_total - value_fee;
            owner_buy = self.data::<Data>().buy_books[index.unwrap()].owner;
            Self::env()
                .transfer(owner_p2p, value_fee)
                .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        } else {
            owner_buy = self.data::<Data>().buy_books[index.unwrap()].sell_owner;
        }

        Self::env()
            .transfer(owner_buy, value_total)
            .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
        self.data::<Data>().buy_books.remove(index.unwrap());

        Ok(())
    }
    /// Open conflict seller
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn open_conflict_seller(&mut self, id: u64) -> Result<(), PSP22Error> {
        let date_block = Self::env().block_timestamp();
        let caller = Self::env().caller();
        let index = self
            .data::<Data>()
            .buy_books.iter()
            .position(
                |order| order.id == id && order.sell_owner == caller && order.confirmed == false && order.date_expire <= date_block
            );
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        let is_receipt = self.data::<Data>().buy_books[index.unwrap()].receipt.as_str();
        if is_receipt != "" {
            let value_total = self.data::<Data>().buy_books[index.unwrap()].value;
            Self::env()
                .transfer(caller, value_total)
                .map_err(|_| PSP22Error::Custom(LunesError::PaymentFail.as_str()))?;
            self.data::<Data>().buy_books.remove(index.unwrap());
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
        let index = self
            .data::<Data>()
            .buy_books.iter()
            .position(|order| order.id == id && order.owner == caller && order.confirmed == false);
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
        let index = self
            .data::<Data>()
            .buy_books.iter()
            .position(|order| order.id == id && order.owner == caller && order.confirmed == false);
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
            .buy_books.iter()
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
            .buy_books.iter()
            .filter(|order| order.owner == caller)
            .cloned()
            .rev()
            .skip(((page - 1) * (100 as u64)).try_into().unwrap())
            .take(100)
            .collect();
        Ok(_all_buy)
    }
    /// Close Buy user
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn close_buy_user(&mut self, id: u64) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
        let index = self
            .data::<Data>()
            .buy_books.iter()
            .position(|order| order.id == id && order.owner == caller && order.confirmed == true);
        if index.is_none() {
            return Err(PSP22Error::Custom(LunesError::NoBuyBook.as_str()));
        }
        self.data::<Data>().buy_books.remove(index.unwrap());
        Ok(())
    }
    /// All books
    #[ink(message)]
    #[modifiers(non_reentrant)]
    fn alll_books(&mut self, page: u64) -> Result<Vec<OrdemBook>, PSP22Error> {
        if page == 0 {
            return Err(PSP22Error::Custom(LunesError::InvalidPage.as_str()));
        }
        let date_block = Self::env().block_timestamp();
        let mut _all: Vec<OrdemBook> = Vec::new();
        _all = self
            .data::<Data>()
            .books.iter()
            .filter(|book| book.cencel == false && book.date_expire > date_block)
            .cloned()
            .rev()
            .skip(((page - 1) * (100 as u64)).try_into().unwrap())
            .take(100)
            .collect();

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
    fn info_contract(&mut self) -> Result<InfoContract, PSP22Error> {        
        Ok(InfoContract{
            fee_p2p: self.data::<Data>().fee_p2p,
            days_expire: self.data::<Data>().days_expire,
            next_buy_id:self.data::<Data>().next_buy_id,
            next_order_id:self.data::<Data>().next_order_id,
            min_sales: self.data::<Data>().min_sales
        })
    }

}
