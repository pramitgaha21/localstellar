use soroban_sdk::{Env, Address, Symbol, vec, Map, U256, contract, contractimpl, Vec};

use crate::{errors::BackendError, storage_types::{StorageKey, UserDetail, UserStatus, LoginProfile, UserProfile}, utils::{is_contract_uninitialized, is_contract_already_initialized}};

#[contract]
pub struct Backend;

#[contractimpl]
impl Backend{
    pub fn init(env: Env, admin: Address, ad_fee: U256, trade_commission: u32, supported_tokens: Vec<Address>){
        is_contract_already_initialized(&env);
        admin.require_auth();
        env.storage().instance().set(&StorageKey::Initialized, &true);
        env.storage().instance().set(&StorageKey::Administrator, &admin);
        env.storage().instance().set(&StorageKey::AdFee, &ad_fee);
        env.storage().instance().set(&StorageKey::AllowedTokens, &supported_tokens);
        env.storage().instance().set(&StorageKey::TradeCommission, &trade_commission);
    }

    pub fn change_admin(env: Env, new_admin: Address) -> bool{
        // checking if the contract is uninitialized
        is_contract_uninitialized(&env);
        let admin = env.storage().instance().get::<StorageKey, Address>(&StorageKey::Administrator).unwrap();
        admin.require_auth();
        env.storage().instance().set(&StorageKey::Administrator, &new_admin);
        true
    }

    pub fn update_ad_fee(env: Env, fee: U256) -> bool{
        // checking if the contract is uninitialized
        is_contract_uninitialized(&env);
        let admin = env.storage().instance().get::<StorageKey, Address>(&StorageKey::Administrator).unwrap();
        admin.require_auth();
        env.storage().instance().set(&StorageKey::AdFee, &fee);
        true
    }

    pub fn update_trade_commission(env: Env, commission: u32) -> bool{
        // checking if the contract is uninitialized
        is_contract_uninitialized(&env);
        let admin = env.storage().instance().get::<StorageKey, Address>(&StorageKey::Administrator).unwrap();
        admin.require_auth();
        env.storage().instance().set(&StorageKey::TradeCommission, &commission);
        true
    }

    pub fn register(env: Env, addr: Address, username: Symbol) -> Result<Symbol, BackendError>{
        // checking if the contract is uninitialized
        is_contract_uninitialized(&env);
        addr.require_auth();
        // checking if the user is already registered
        if let Some(_) = env.storage().instance().get::<_, UserDetail>(&addr){
            return Err(BackendError::UserAlreadyRegistered)
        }
        // checking if the username is taken
        if let Some(_) = env.storage().instance().get::<_, Address>(&StorageKey::Username(username.clone())){
            return Err(BackendError::UsernameTaken)
        }
        let user_detail = UserDetail{
            username: username.clone(),
            addr: addr.clone(),
            registered_at: env.ledger().timestamp(),
            status: UserStatus::Whitelisted,
            ongoing_orders: vec![&env],
            past_orders: Map::new(&env)
        };
        env.storage().instance().set(&addr, &user_detail);
        Ok(username)
    }

    pub fn login(env: Env, addr: Address) -> Result<LoginProfile, BackendError>{
        // checking if the contract is uninitialized
        is_contract_uninitialized(&env);
        addr.require_auth();
        if let Some(user_detail) = env.storage().instance().get::<_, UserDetail>(&addr){
            unimplemented!()
        }else{
            Err(BackendError::UserNotRegisted)
        }
    }

    pub fn view_profile(env: Env, addr: Address) -> Result<UserProfile, BackendError>{
        // checking if the contract is uninitialized
        is_contract_uninitialized(&env);
        if let Some(user_detail) = env.storage().instance().get::<_, UserDetail>(&addr){
            Ok(UserProfile::from(user_detail))
        }else{
            Err(BackendError::UserNotRegisted)
        }
    }

    // pub fn apply_for_moderator(env: Env){}

    // pub fn decision_on_approval_of_moderator(env: Env){}

    // pub fn blacklist_moderator(env: Env){}

    // pub fn blacklist_user(env: Env){}

    pub fn place_an_ad(env: Env){}

    pub fn cancel_ad(env: Env){}

    pub fn make_an_order(env: Env){}

    pub fn mark_paid(env: Env){}

    pub fn received_and_transfer(env: Env){}

    // pub fn raise_dispute(env: Env){}

    // pub fn re_ask_for_moderator(env: Env){}
}