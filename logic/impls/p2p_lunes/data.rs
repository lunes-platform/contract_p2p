use openbrush::traits::{ AccountId, Balance, String };
use ink_prelude::vec::Vec;

#[derive(Default, Debug)]
#[openbrush::storage_item]
pub struct Data {
    pub days_expire: u64,
    pub next_buy_id: u64,
    pub next_order_id: u64,
    pub min_sales: Balance,
    pub fee_p2p: u64,
    pub books: Vec<OrdemBook>,
    pub buy_books: Vec<BuyBook>,
}
#[derive(Debug, PartialEq, Clone, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct OrdemBook {
    pub id: u64,
    pub value: Balance,
    pub price: Balance,
    pub owner: AccountId,
    pub pair: String,
    pub address_payment: String,
    pub cencel: bool,
    pub date_created: u64,
    pub date_expire: u64,
}

#[derive(Debug, PartialEq, Clone, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct BuyBook {
    pub id: u64,
    pub value: Balance,
    pub price: Balance,
    pub owner: AccountId,
    pub sell_owner: AccountId,
    pub receipt: String,
    pub address_payment: String,
    pub pair: String,
    pub date_created: u64,
    pub date_expire: u64,
    pub confirmed: bool,
    pub conflict: bool,
}

#[derive(Debug, PartialEq, Clone, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct InfoContract {
    pub fee_p2p: u64,
    pub days_expire: u64,
    pub next_buy_id: u64,
    pub next_order_id: u64,
    pub min_sales: Balance,
}

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum LunesError {
    BadMintValue,
    InvalidPage,
    NoBuyBook,
    NoBook,
    PaymentFail,
    ErroCancel
}

impl LunesError {
    pub fn as_str(&self) -> String {
        match self {
            LunesError::InvalidPage => String::from("InvalidPage"),
            LunesError::BadMintValue => String::from("BadMintValue"),
            LunesError::NoBuyBook => String::from("NoBuyBook"),
            LunesError::NoBook => String::from("NoBook"),
            LunesError::PaymentFail => String::from("PaymentFail"),
            LunesError::ErroCancel => String::from("ErroCancel"),
        }
    }
}