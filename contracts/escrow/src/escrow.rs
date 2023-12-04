use soroban_sdk::{Env, contract, contractimpl, Address};

use crate::storage_key::{CreateEscrowData, StorageKey};

#[contract]
pub struct Escrow;

#[contractimpl]
impl Escrow{
    pub fn init(){}

    pub fn create_escrow(env: Env, create_escrow_data: CreateEscrowData){
        let backend = env.storage().instance().get::<StorageKey, Address>(&StorageKey::Backend).unwrap();
        backend.require_auth();
    }
}