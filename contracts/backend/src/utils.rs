use soroban_sdk::{token::TokenClient, Address, Env};

pub fn token_transfer(env: &Env, token: &Address, from: &Address, to: &Address, amount: i128) {
    let token_client = TokenClient::new(env, token);
    token_client.transfer(from, to, &amount);
}
