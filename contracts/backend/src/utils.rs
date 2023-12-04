use soroban_sdk::{Env, panic_with_error, Address, Map};

use crate::{storage_types::{StorageKey, ModeratorDetail}, errors::BackendError};

pub fn is_contract_already_initialized(env: &Env){
    if let Some(true) = env.storage().instance().get::<StorageKey, bool>(&StorageKey::Initialized){
        panic_with_error!(&env, BackendError::ContractAlreadyInitialized)
    }
}

pub fn is_contract_uninitialized(env: &Env){
    if let Some(false) | None = env.storage().instance().get::<StorageKey, bool>(&StorageKey::Initialized){
        panic_with_error!(&env, BackendError::Uninitialized)
    }
}

pub fn get_random_moderator(env: &Env) -> ModeratorDetail{
    let moderators_mapping = env.storage().instance().get::<_, Map<u64, ModeratorDetail>>(&StorageKey::Moderators).unwrap();
    let p_rng = env.prng();
    let rand_number = p_rng.u64_in_range(0..moderators_mapping.len() as u64);
    moderators_mapping.get(rand_number).unwrap()
}