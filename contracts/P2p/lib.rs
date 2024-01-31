#![cfg_attr(not(feature = "std"), no_std, no_main)]
#[openbrush::implementation(Ownable)]
#[openbrush::contract]
pub mod p2p_lunes {
    use openbrush::{
        contracts::{ ownable, reentrancy_guard, traits::psp22::PSP22Error },
        traits::Storage,
    };
    use p2p_lunes_pkg::impls::p2p_lunes::{ p2p_lunes::*, data };

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
    /// Event emitted when a order create
    #[ink(event)]
    pub struct OrderEvent {
        #[ink(topic)]
        type_order: u32, //1 = Buy - 2 = Sall
        #[ink(topic)]
        value: Balance, // Value
        #[ink(topic)]
        id: u64, //Id order sell ou buy
    }
    impl P2pLunesImpl for P2pLunesContract {}

    impl P2pLunesContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            let mut instance = Self::default();
            let caller = instance.env().caller();
            ownable::InternalImpl::_init_with_owner(&mut instance, caller);

            instance.payable_p2p.next_buy_id = 1;
            instance.payable_p2p.next_order_id = 1;
            instance.payable_p2p.fee_p2p = 3;
            instance.payable_p2p.min_sales = 10_000_000_000;
            instance.payable_p2p.days_expire = 605024000; //7 Days in Timestamp
            instance.payable_p2p.books = Default::default();
            instance.payable_p2p.buy_books = Default::default();
            instance
        }
        /// Set envent order
        #[ink(message)]
        pub fn set_envent_order(
            &self,
            id: u64
        ) -> Result<(), PSP22Error> {
            if id == 0 {
                return Err(PSP22Error::Custom("Error".into()));
            }
            
            self.env().emit_event(OrderEvent {
                type_order: 1,
                value: 1,
                id: id,
            });
            Ok(())
        }
    }
}
