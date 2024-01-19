#![cfg_attr(not(feature = "std"), no_std, no_main)]
#[openbrush::implementation(Ownable)]
#[openbrush::contract]
pub mod p2p_lunes{
    use openbrush::{
        contracts::{
            ownable,           
            reentrancy_guard,
        },
        traits::Storage,
    };
    use p2p_lunes_pkg::impls::p2p_lunes::{p2p_lunes::*, data };

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct P2pLunesContract {
        #[storage_field]
        payable_p2p: data::Data,
        #[storage_field]
        guard: reentrancy_guard::Data,
        #[storage_field]
        ownable: ownable::Data,
    }
    impl P2pLunesImpl for P2pLunesContract {}

    impl P2pLunesContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            let mut instance = Self::default();
            let caller = instance.env().caller();
            ownable::InternalImpl::_init_with_owner(&mut instance, caller);

            let mut instance = Self::default();
            instance.payable_p2p.next_buy_id = 1;
            instance.payable_p2p.next_order_id = 1;
            instance.payable_p2p.fee_p2p = 1;
            instance.payable_p2p.min_sales = 10_000_000_000;
            instance.payable_p2p.days_expire = 605024000; //7 Days in Timestamp
            instance.payable_p2p.books = Default::default();
            instance.payable_p2p.buy_books = Default::default();
            instance
        }
    }
   
}