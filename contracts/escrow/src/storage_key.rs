use soroban_sdk::{U256, contracttype, Address};

#[contracttype]
pub struct CreateEscrowData{
    pub buyer: Address,
    pub seller: Address,
    pub token: Address,
    pub amount: U256,
}

#[contracttype]
pub struct EscrowDetail{
    pub escrow_id: U256,
    pub created_at: u64,
    pub buyer: Address,
    pub seller: Address,
    pub token: Address,
    pub amount: U256,
}

#[contracttype]
pub enum StorageKey{
    Administrator,
    Backend,
    Count,
    EscrowId(U256),
}