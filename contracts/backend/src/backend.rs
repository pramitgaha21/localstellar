use soroban_sdk::{
    contract, contracterror, contractimpl, vec, Address, Env, Map, String, Symbol, Vec, U256,
};

use crate::{
    storage_types::{
        BalanceDetail, BalanceKey, Decision, DisputeChatKey, DisputeDetails, DisputeStatus,
        LoggedProfile, OfferDetail, OfferType, StorageKey, TradeChatDetail, TradeChatKey,
        TradeDetails, TradeStatus, UserDetail, UserStatus,
    },
    utils::token_transfer,
};

#[contracterror]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
#[repr(u8)]
pub enum BackendError {
    Uninitialized = 0,
    AlreadyInitialized = 1,
    UserAlreadyExist = 2,
    Unauthorized = 3,
    NonExistingUser = 4,
    NotEnoughBalance = 5,
    NegativeAmountFound = 6,
    ArithmeticOverflow = 7,
    TooManyOffers = 8,
    UnsupportedToken = 9,
    NonExistingTradeId = 10,
    NonExistingOfferId = 11,
    NonExistingChatIndex = 12,
    AlreadyMadePayment = 13,
    TradeNotActive = 14,
    DisputeInactive = 15,
    NonExistingDisputeId = 16,
    InvalidDecision = 17,
}

#[contract]
pub struct Backend;

#[contractimpl]
impl Backend {
    fn get_trade_id(env: &Env) -> U256 {
        let mut current_trade_count: U256 = env
            .storage()
            .persistent()
            .get(&StorageKey::TradeCount)
            .unwrap_or(U256::from_u128(env, 0));
        current_trade_count = current_trade_count.add(&U256::from_u128(env, 1));
        env.storage()
            .persistent()
            .set(&StorageKey::TradeCount, &current_trade_count);
        current_trade_count
    }

    fn get_offer_id(env: &Env) -> U256 {
        let mut current_offer_count: U256 = env
            .storage()
            .persistent()
            .get(&StorageKey::OfferCount)
            .unwrap_or(U256::from_u128(env, 0));
        current_offer_count = current_offer_count.add(&U256::from_u128(env, 1));
        env.storage()
            .persistent()
            .set(&StorageKey::OfferCount, &current_offer_count);
        current_offer_count
    }

    fn get_dispute_id(env: &Env) -> u128 {
        let mut current_dispute_count: u128 = env
            .storage()
            .persistent()
            .get(&StorageKey::DisputeCount)
            .unwrap_or(0);
        current_dispute_count += 1;
        env.storage()
            .persistent()
            .set(&StorageKey::DisputeCount, &current_dispute_count);
        current_dispute_count
    }

    pub fn initialize(env: Env, caller: Address, commission: i32) -> Result<(), BackendError> {
        caller.require_auth();
        if env
            .storage()
            .persistent()
            .get::<_, Address>(&StorageKey::Admin)
            .is_some()
        {
            return Err(BackendError::AlreadyInitialized);
        }
        env.storage().persistent().set(&StorageKey::Admin, &caller);
        env.storage()
            .persistent()
            .set(&StorageKey::Commission, &commission);
        Ok(())
    }

    pub fn change_admin(
        env: Env,
        caller: Address,
        new_admin: Address,
    ) -> Result<Address, BackendError> {
        caller.require_auth();
        let admin: Address = env.storage().persistent().get(&StorageKey::Admin).unwrap();
        if admin != caller {
            return Err(BackendError::Unauthorized);
        }
        env.storage()
            .persistent()
            .set(&StorageKey::Admin, &new_admin);
        Ok(new_admin)
    }

    pub fn change_commission_fee(
        env: Env,
        caller: Address,
        new_fee: i32,
    ) -> Result<i32, BackendError> {
        caller.require_auth();
        let admin: Address = env.storage().persistent().get(&StorageKey::Admin).unwrap();
        if caller != admin {
            return Err(BackendError::Unauthorized);
        }
        env.storage()
            .persistent()
            .set(&StorageKey::Commission, &new_fee);
        Ok(new_fee)
    }

    pub fn add_token(env: Env, caller: Address, tokens: Vec<Address>) -> Result<(), BackendError> {
        caller.require_auth();
        let admin: Address = env.storage().persistent().get(&StorageKey::Admin).unwrap();
        if caller != admin {
            return Err(BackendError::Unauthorized);
        }
        let mut allowed_tokens: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::AllowedTokens)
            .unwrap_or(vec![&env]);
        tokens.iter().for_each(|token| {
            if !allowed_tokens.contains(&token) {
                allowed_tokens.push_back(token);
            }
        });
        env.storage()
            .persistent()
            .set(&StorageKey::AllowedTokens, &allowed_tokens);
        Ok(())
    }

    pub fn remove_token(
        env: Env,
        caller: Address,
        tokens: Vec<Address>,
    ) -> Result<(), BackendError> {
        caller.require_auth();
        let admin: Address = env.storage().persistent().get(&StorageKey::Admin).unwrap();
        if caller != admin {
            return Err(BackendError::Unauthorized);
        }
        let mut allowed_tokens: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::AllowedTokens)
            .unwrap_or(vec![&env]);
        for token in tokens {
            if let Ok(index) = allowed_tokens.binary_search(token) {
                allowed_tokens.remove(index);
            }
        }
        env.storage()
            .persistent()
            .set(&StorageKey::AllowedTokens, &allowed_tokens);
        Ok(())
    }

    pub fn register(
        env: Env,
        addr: Address,
        username: Symbol,
    ) -> Result<LoggedProfile, BackendError> {
        addr.require_auth();
        if env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
            .is_some()
        {
            return Err(BackendError::UserAlreadyExist);
        }
        let timestamp = env.ledger().timestamp();
        let user_detail = UserDetail {
            username,
            registered_at: timestamp,
            status: UserStatus::Whitelisted,
            no_of_successful_trades: 0,
            no_of_unsuccessful_trades: 0,
            ongoing_trades: Vec::new(&env),
            ongoing_offers: Vec::new(&env),
            past_trades: Map::new(&env),
        };
        env.storage()
            .persistent()
            .set(&StorageKey::User(addr), &user_detail);
        let allowed_tokens: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::AllowedTokens)
            .unwrap_or(vec![&env]);
        let mut balance = Map::new(&env);
        allowed_tokens.iter().for_each(|token| {
            balance.set(token, BalanceDetail::default());
        });
        Ok(LoggedProfile::from((user_detail, balance)))
    }

    pub fn login(env: Env, addr: Address) -> Result<LoggedProfile, BackendError> {
        addr.require_auth();
        let user_detail = match env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
        {
            None => return Err(BackendError::NonExistingUser),
            Some(profile) => profile,
        };
        let allowed_tokens: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::AllowedTokens)
            .unwrap_or(vec![&env]);
        let mut balances = Map::new(&env);
        allowed_tokens.iter().for_each(|token| {
            let balance: BalanceDetail = env
                .storage()
                .instance()
                .get(&StorageKey::Balance(BalanceKey {
                    user_address: addr.clone(),
                    token: token.clone(),
                }))
                .unwrap_or_default();
            balances.set(token, balance);
        });
        Ok(LoggedProfile::from((user_detail, balances)))
    }

    pub fn withdraw(
        env: Env,
        addr: Address,
        token: Address,
        amount: i128,
    ) -> Result<BalanceDetail, BackendError> {
        addr.require_auth();
        if amount.is_negative() || amount == 0 {
            return Err(BackendError::NegativeAmountFound);
        }
        let allowed_tokens: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::AllowedTokens)
            .unwrap_or(vec![&env]);
        if !allowed_tokens.contains(&token) {
            return Err(BackendError::UnsupportedToken);
        }
        if env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
            .is_none()
        {
            return Err(BackendError::NonExistingUser);
        }
        let mut current_balance = env
            .storage()
            .instance()
            .get::<_, BalanceDetail>(&StorageKey::Balance(BalanceKey {
                user_address: addr.clone(),
                token: token.clone(),
            }))
            .unwrap_or_default();
        let available_balance = current_balance.total_balance
            - current_balance.locked_balance
            - current_balance.freezed_balance;
        if amount > available_balance {
            return Err(BackendError::NotEnoughBalance);
        }
        current_balance.total_balance = match current_balance.total_balance.checked_sub(amount) {
            None => return Err(BackendError::ArithmeticOverflow),
            Some(amount) => {
                if amount.is_negative() {
                    return Err(BackendError::NegativeAmountFound);
                }
                amount
            }
        };
        env.storage().instance().set(
            &StorageKey::Balance(BalanceKey {
                user_address: addr.clone(),
                token: token.clone(),
            }),
            &current_balance,
        );
        token_transfer(&env, &token, &env.current_contract_address(), &addr, amount);

        Ok(current_balance)
    }

    pub fn deposit(
        env: Env,
        addr: Address,
        token: Address,
        amount: i128,
    ) -> Result<BalanceDetail, BackendError> {
        addr.require_auth();
        if env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
            .is_none()
        {
            return Err(BackendError::NonExistingUser);
        }
        token_transfer(&env, &token, &addr, &env.current_contract_address(), amount);
        let mut current_balance = env
            .storage()
            .instance()
            .get::<_, BalanceDetail>(&StorageKey::Balance(BalanceKey {
                user_address: addr.clone(),
                token: token.clone(),
            }))
            .unwrap_or_default();
        current_balance.total_balance += amount;
        env.storage().instance().set(
            &StorageKey::Balance(BalanceKey {
                user_address: addr.clone(),
                token,
            }),
            &current_balance,
        );
        Ok(current_balance)
    }

    pub fn offer_list(env: Env) -> Map<U256, OfferDetail> {
        let mut count: U256 = match env.storage().persistent().get(&StorageKey::OfferCount) {
            None => return Map::new(&env),
            Some(count) => count,
        };
        let mut offers = Map::new(&env);
        while count != U256::from_u32(&env, 0) {
            if offers.len() == 30 {
                return offers;
            }
            let offer = match env
                .storage()
                .instance()
                .get(&StorageKey::Offer(count.clone()))
            {
                None => continue,
                Some(offer) => offer,
            };
            offers.set(count.clone(), offer);
            count = count.sub(&U256::from_u32(&env, 1));
        }
        offers
    }

    pub fn my_offer_list(env: Env, addr: Address) -> Result<Map<U256, OfferDetail>, BackendError> {
        let user_profile = match env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
        {
            None => return Err(BackendError::NonExistingUser),
            Some(profile) => profile,
        };
        let mut offers = Map::new(&env);
        for offer_id in user_profile.ongoing_offers.iter() {
            let offer: OfferDetail = match env
                .storage()
                .instance()
                .get(&StorageKey::Offer(offer_id.clone()))
            {
                None => return Err(BackendError::NonExistingOfferId),
                Some(offer) => offer,
            };
            offers.set(offer_id, offer);
        }
        Ok(offers)
    }

    pub fn create_offer(
        env: Env,
        addr: Address,
        offer_type: OfferType,
        currency: Symbol,
        token: Address,
        total_amount: i128,
        rate: u32,
        trade_limit: (i128, i128),
        time_limit: u32,
        payment_methods: Vec<String>,
        terms: String,
    ) -> Result<OfferDetail, BackendError> {
        addr.require_auth();
        let mut user_detail = match env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
        {
            None => return Err(BackendError::NonExistingUser),
            Some(profile) => profile,
        };
        if user_detail.ongoing_offers.len() > 5 {
            return Err(BackendError::TooManyOffers);
        }
        let allowed_tokens: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::AllowedTokens)
            .unwrap_or(vec![&env]);
        if !allowed_tokens.contains(&token) {
            return Err(BackendError::UnsupportedToken);
        }
        // balance gets locked in case of selling only
        if offer_type == OfferType::Sell {
            let mut current_balance: BalanceDetail = env
                .storage()
                .instance()
                .get(&StorageKey::Balance(BalanceKey {
                    user_address: addr.clone(),
                    token: token.clone(),
                }))
                .unwrap_or_default();
            let available_balance = current_balance.total_balance
                - current_balance.locked_balance
                - current_balance.freezed_balance;
            if total_amount > available_balance {
                return Err(BackendError::NotEnoughBalance);
            }
            current_balance.freezed_balance += total_amount;
            env.storage().instance().set(
                &StorageKey::Balance(BalanceKey {
                    user_address: addr.clone(),
                    token: token.clone(),
                }),
                &current_balance,
            );
        }
        let offer_id = Self::get_offer_id(&env);
        // locking the balance
        let offer = OfferDetail {
            offer_type,
            offer_id: offer_id.clone(),
            offer_by: (addr.clone(), user_detail.username.clone()),
            currency,
            total_tradeable_amount: total_amount,
            rate,
            terms,
            accepted_payment_methods: payment_methods,
            time_limit,
            token: token.clone(),
            trade_limit,
        };
        user_detail.ongoing_offers.push_back(offer_id.clone());
        env.storage()
            .persistent()
            .set(&StorageKey::User(addr.clone()), &user_detail);
        env.storage()
            .instance()
            .set(&StorageKey::Offer(offer_id), &offer.clone());
        Ok(offer)
    }

    pub fn get_dispute_detail(
        env: Env,
        addr: Address,
        id: u128,
    ) -> Result<DisputeDetails, BackendError> {
        match env
            .storage()
            .instance()
            .get::<_, DisputeDetails>(&StorageKey::Dispute(id))
        {
            None => Err(BackendError::NonExistingDisputeId),
            Some(detail) => {
                if addr == detail.dispute_started_by || addr == detail.other_party {
                    Ok(detail)
                } else {
                    Err(BackendError::Unauthorized)
                }
            }
        }
    }

    pub fn get_trade_details(
        env: Env,
        addr: Address,
        trade_id: U256,
    ) -> Result<TradeDetails, BackendError> {
        addr.require_auth();
        let profile = match env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
        {
            None => return Err(BackendError::NonExistingUser),
            Some(profile) => profile,
        };
        if profile.ongoing_trades.contains(&trade_id)
            || profile.past_trades.contains_key(trade_id.clone())
        {
            let trade = env
                .storage()
                .instance()
                .get(&StorageKey::Trade(trade_id.clone()))
                .unwrap();
            Ok(trade)
        } else {
            Err(BackendError::NonExistingTradeId)
        }
    }

    pub fn my_active_trade_list(
        env: Env,
        addr: Address,
    ) -> Result<Map<U256, TradeDetails>, BackendError> {
        let profile = match env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
        {
            None => return Err(BackendError::NonExistingUser),
            Some(profile) => profile,
        };
        let mut trades = Map::new(&env);
        for trade_id in profile.ongoing_trades.iter() {
            let trade = env
                .storage()
                .instance()
                .get(&StorageKey::Trade(trade_id.clone()))
                .unwrap();
            trades.set(trade_id, trade);
        }
        Ok(trades)
    }

    pub fn my_past_trade_list(
        env: Env,
        addr: Address,
    ) -> Result<Map<U256, TradeDetails>, BackendError> {
        let profile = match env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
        {
            None => return Err(BackendError::NonExistingUser),
            Some(profile) => profile,
        };
        let mut trades = Map::new(&env);
        for trade_id in profile.past_trades.keys().iter() {
            let trade = env
                .storage()
                .instance()
                .get(&StorageKey::Trade(trade_id.clone()))
                .unwrap();
            trades.set(trade_id, trade);
        }
        Ok(trades)
    }

    pub fn place_order(
        env: Env,
        addr: Address,
        offer_id: U256,
        amount: i128,
    ) -> Result<TradeDetails, BackendError> {
        addr.require_auth();
        if amount <= 0 {
            return Err(BackendError::NegativeAmountFound);
        }
        let profile = match env
            .storage()
            .persistent()
            .get::<_, UserDetail>(&StorageKey::User(addr.clone()))
        {
            None => return Err(BackendError::NonExistingUser),
            Some(profile) => profile,
        };
        let mut offer_detail: OfferDetail = match env
            .storage()
            .instance()
            .get(&StorageKey::Offer(offer_id.clone()))
        {
            None => return Err(BackendError::NonExistingOfferId),
            Some(offer) => offer,
        };
        if amount > offer_detail.total_tradeable_amount {
            return Err(BackendError::NotEnoughBalance);
        }
        let (seller_address, mut seller_detail, buyer_address, mut buyer_detail) =
            match offer_detail.offer_type {
                OfferType::Sell => {
                    let seller_detail: UserDetail = env
                        .storage()
                        .persistent()
                        .get(&StorageKey::User(offer_detail.offer_by.0.clone()))
                        .unwrap();
                    let mut balance: BalanceDetail = env
                        .storage()
                        .instance()
                        .get(&StorageKey::Balance(BalanceKey {
                            user_address: offer_detail.offer_by.0.clone(),
                            token: offer_detail.token.clone(),
                        }))
                        .unwrap_or_default();
                    if amount > balance.freezed_balance {
                        return Err(BackendError::NotEnoughBalance);
                    }
                    balance.freezed_balance -= amount;
                    balance.locked_balance += amount;
                    env.storage().instance().set(
                        &StorageKey::Balance(BalanceKey {
                            user_address: offer_detail.offer_by.0.clone(),
                            token: offer_detail.token.clone(),
                        }),
                        &balance,
                    );
                    (
                        offer_detail.offer_by.0.clone(),
                        seller_detail,
                        addr.clone(),
                        profile,
                    )
                }
                OfferType::Buy => {
                    let buyer_detail: UserDetail = env
                        .storage()
                        .persistent()
                        .get(&StorageKey::User(offer_detail.offer_by.0.clone()))
                        .unwrap();
                    let mut balance: BalanceDetail = env
                        .storage()
                        .instance()
                        .get(&StorageKey::Balance(BalanceKey {
                            user_address: addr.clone(),
                            token: offer_detail.token.clone(),
                        }))
                        .unwrap_or_default();
                    let available_balance =
                        balance.total_balance - balance.freezed_balance - balance.locked_balance;
                    if amount > available_balance {
                        return Err(BackendError::NotEnoughBalance);
                    }
                    balance.locked_balance += amount;
                    env.storage().instance().set(
                        &StorageKey::Balance(BalanceKey {
                            user_address: addr.clone(),
                            token: offer_detail.token.clone(),
                        }),
                        &balance,
                    );
                    (
                        addr.clone(),
                        profile,
                        offer_detail.offer_by.0.clone(),
                        buyer_detail,
                    )
                }
            };
        offer_detail.total_tradeable_amount -= amount;
        env.storage()
            .instance()
            .set(&StorageKey::Offer(offer_id.clone()), &offer_detail);
        let trade_id = Self::get_trade_id(&env);
        let trade_detail = TradeDetails {
            msg_count: 0,
            dispute_id: None,
            bounded_offer_id: offer_id,
            buyer_marked_paid_at: None,
            seller_released_at: None,
            currency: offer_detail.currency,
            total_amount: amount,
            rate: offer_detail.rate,
            buyer: (buyer_address.clone(), buyer_detail.username.clone()),
            seller: (seller_address.clone(), seller_detail.username.clone()),
            token: offer_detail.token,
            status: TradeStatus::Ongoing,
            trade_started_at: env.ledger().timestamp(),
            total_amount_to_be_paid: amount as u128 * offer_detail.rate as u128,
        };
        seller_detail.ongoing_trades.push_back(trade_id.clone());
        buyer_detail.ongoing_trades.push_back(trade_id.clone());
        env.storage()
            .persistent()
            .set(&StorageKey::User(buyer_address), &buyer_detail);
        env.storage()
            .persistent()
            .set(&StorageKey::User(seller_address), &seller_detail);
        env.storage()
            .instance()
            .set(&StorageKey::Trade(trade_id), &trade_detail);
        Ok(trade_detail)
    }

    pub fn close_trade(
        env: Env,
        addr: Address,
        trade_id: U256,
    ) -> Result<TradeDetails, BackendError> {
        addr.require_auth();
        let mut trade_detail: TradeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Trade(trade_id.clone()))
        {
            None => return Err(BackendError::NonExistingTradeId),
            Some(detail) => detail,
        };
        if trade_detail.status != TradeStatus::Ongoing {
            return Err(BackendError::TradeNotActive);
        }
        if trade_detail.buyer_marked_paid_at.is_some() && addr != trade_detail.buyer.0
            || trade_detail.buyer_marked_paid_at.is_none()
                && addr != trade_detail.buyer.0
                && addr != trade_detail.seller.0
        {
            return Err(BackendError::Unauthorized);
        }
        let mut offer_detail: OfferDetail = env
            .storage()
            .instance()
            .get(&StorageKey::Offer(trade_detail.bounded_offer_id.clone()))
            .unwrap();
        let mut seller_detail: UserDetail = env
            .storage()
            .persistent()
            .get(&StorageKey::User(trade_detail.seller.0.clone()))
            .unwrap();
        let mut buyer_detail: UserDetail = env
            .storage()
            .persistent()
            .get(&StorageKey::User(trade_detail.buyer.0.clone()))
            .unwrap();
        trade_detail.status = TradeStatus::Cancelled;
        let index = seller_detail
            .ongoing_trades
            .binary_search(&trade_id)
            .unwrap();
        seller_detail.ongoing_trades.remove(index);
        seller_detail.past_trades.set(trade_id.clone(), ());
        let index = buyer_detail
            .ongoing_trades
            .binary_search(&trade_id)
            .unwrap();
        buyer_detail.ongoing_trades.remove(index);
        buyer_detail.past_trades.set(trade_id.clone(), ());
        let mut seller_balance: BalanceDetail = env
            .storage()
            .instance()
            .get(&StorageKey::Balance(BalanceKey {
                user_address: trade_detail.buyer.0.clone(),
                token: trade_detail.token.clone(),
            }))
            .unwrap();

        if offer_detail.offer_by.0 == trade_detail.seller.0 {
            seller_balance.locked_balance -= trade_detail.total_amount;
            seller_balance.freezed_balance += trade_detail.total_amount;
        } else {
            seller_balance.locked_balance -= trade_detail.total_amount;
        }
        offer_detail.total_tradeable_amount += trade_detail.total_amount;
        env.storage().persistent().set(
            &StorageKey::User(trade_detail.seller.0.clone()),
            &seller_detail,
        );
        env.storage().persistent().set(
            &StorageKey::User(trade_detail.buyer.0.clone()),
            &buyer_detail,
        );
        env.storage()
            .instance()
            .set(&StorageKey::Trade(trade_id), &trade_detail);
        env.storage().instance().set(
            &StorageKey::Offer(trade_detail.bounded_offer_id.clone()),
            &offer_detail,
        );
        env.storage().instance().set(
            &StorageKey::Balance(BalanceKey {
                user_address: trade_detail.seller.0.clone(),
                token: trade_detail.token.clone(),
            }),
            &seller_balance,
        );
        Ok(trade_detail)
    }

    pub fn dispute_list(env: Env) -> Map<u128, DisputeDetails> {
        let mut disputes: Map<u128, DisputeDetails> = Map::new(&env);
        let mut current_index = match env.storage().persistent().get(&StorageKey::DisputeCount) {
            None => return disputes,
            Some(count) => count,
        };
        while current_index != 0 {
            let dispute: DisputeDetails = env
                .storage()
                .instance()
                .get(&StorageKey::Dispute(current_index))
                .unwrap();
            disputes.set(current_index, dispute);
            current_index -= 1;
        }
        disputes
    }

    pub fn raise_dispute(
        env: Env,
        addr: Address,
        trade_id: U256,
    ) -> Result<DisputeDetails, BackendError> {
        addr.require_auth();
        let mut trade_detail: TradeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Trade(trade_id.clone()))
        {
            None => return Err(BackendError::NonExistingTradeId),
            Some(detail) => detail,
        };
        if trade_detail.status != TradeStatus::Ongoing {
            return Err(BackendError::TradeNotActive);
        }
        if !trade_detail.is_seller(&addr) && !trade_detail.is_buyer(&addr) {
            return Err(BackendError::Unauthorized);
        }
        trade_detail.status = TradeStatus::InDispute;
        let dispute_id = Self::get_dispute_id(&env);
        let (dispute_started_by, other_party) = if trade_detail.is_seller(&addr) {
            (addr.clone(), trade_detail.buyer.0.clone())
        } else {
            (addr.clone(), trade_detail.seller.0.clone())
        };
        trade_detail.dispute_id = Some(dispute_id);
        let dispute_detail = DisputeDetails {
            dispute_status: DisputeStatus::WaitingApproval,
            bounded_trade_id: trade_id.clone(),
            ended_at: None,
            created_at: env.ledger().timestamp(),
            is_claim_approved: None,
            decision: None,
            msg_count: 0,
            dispute_started_by,
            other_party,
        };
        env.storage()
            .instance()
            .set(&StorageKey::Trade(trade_id), &trade_detail);
        env.storage()
            .instance()
            .set(&StorageKey::Dispute(dispute_id), &dispute_detail);
        Ok(dispute_detail)
    }

    pub fn decision_on_claim(
        env: Env,
        addr: Address,
        dispute_id: u128,
        approval: bool,
    ) -> Result<DisputeDetails, BackendError> {
        addr.require_auth();
        let mods: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::Moderators)
            .unwrap_or(vec![&env]);
        if !mods.contains(&addr) {
            return Err(BackendError::Unauthorized);
        }
        let mut dispute_detail: DisputeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Dispute(dispute_id))
        {
            None => return Err(BackendError::NonExistingDisputeId),
            Some(detail) => detail,
        };
        if dispute_detail.dispute_status != DisputeStatus::WaitingApproval {
            return Err(BackendError::DisputeInactive);
        }
        if approval {
            dispute_detail.dispute_status = DisputeStatus::Ongoing;
        } else {
            dispute_detail.dispute_status = DisputeStatus::Rejected;
            let mut trade_detail: TradeDetails = env
                .storage()
                .instance()
                .get(&StorageKey::Trade(dispute_detail.bounded_trade_id.clone()))
                .unwrap();
            trade_detail.status = TradeStatus::Ongoing;
            env.storage().instance().set(
                &StorageKey::Trade(dispute_detail.bounded_trade_id.clone()),
                &trade_detail,
            );
        }
        dispute_detail.is_claim_approved = Some(approval);
        env.storage()
            .instance()
            .set(&StorageKey::Dispute(dispute_id), &dispute_detail);
        Ok(dispute_detail)
    }

    /*
     * Decision must be 0 or 1
     * ReleaseToBuyer = 0,
     * ReleaseToSeller = 1
     */
    pub fn mod_decision_on_dispute(
        env: Env,
        addr: Address,
        dispute_id: u128,
        decision: u32,
    ) -> Result<DisputeDetails, BackendError> {
        addr.require_auth();
        if decision != 0 && decision != 1 {
            return Err(BackendError::InvalidDecision);
        }
        let mods: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::Moderators)
            .unwrap_or(vec![&env]);
        if !mods.contains(&addr) {
            return Err(BackendError::Unauthorized);
        }
        let mut dispute_detail: DisputeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Dispute(dispute_id))
        {
            None => return Err(BackendError::NonExistingDisputeId),
            Some(detail) => detail,
        };
        if dispute_detail.dispute_status != DisputeStatus::Ongoing {
            return Err(BackendError::DisputeInactive);
        }
        let decision = Decision::from_u32(decision);
        let mut trade_details: TradeDetails = env
            .storage()
            .instance()
            .get(&StorageKey::Trade(dispute_detail.bounded_trade_id.clone()))
            .unwrap();
        let (seller_address, mut seller_detail, buyer_address, mut buyer_detail) = {
            let seller_detail: UserDetail = env
                .storage()
                .persistent()
                .get(&StorageKey::User(trade_details.seller.0.clone()))
                .unwrap();
            let buyer_detail: UserDetail = env
                .storage()
                .persistent()
                .get(&StorageKey::User(trade_details.buyer.0.clone()))
                .unwrap();
            (
                trade_details.seller.0.clone(),
                seller_detail,
                trade_details.buyer.0.clone(),
                buyer_detail,
            )
        };
        match decision {
            Decision::ReleaseToBuyer => token_transfer(
                &env,
                &trade_details.token,
                &env.current_contract_address(),
                &buyer_address,
                trade_details.total_amount,
            ),
            Decision::ReleaseToSeller => token_transfer(
                &env,
                &trade_details.token,
                &env.current_contract_address(),
                &seller_address,
                trade_details.total_amount,
            ),
        }
        let index = seller_detail
            .ongoing_trades
            .binary_search(&dispute_detail.bounded_trade_id)
            .unwrap();
        seller_detail.ongoing_trades.remove(index);
        seller_detail
            .past_trades
            .set(dispute_detail.bounded_trade_id.clone(), ());
        let index = buyer_detail
            .ongoing_trades
            .binary_search(&dispute_detail.bounded_trade_id)
            .unwrap();
        buyer_detail.ongoing_trades.remove(index);
        buyer_detail
            .past_trades
            .set(dispute_detail.bounded_trade_id.clone(), ());
        let mut seller_balance: BalanceDetail = env
            .storage()
            .instance()
            .get(&StorageKey::Balance(BalanceKey {
                user_address: seller_address.clone(),
                token: trade_details.token.clone(),
            }))
            .unwrap();
        let mut buyer_balance: BalanceDetail = env
            .storage()
            .instance()
            .get(&StorageKey::Balance(BalanceKey {
                user_address: buyer_address.clone(),
                token: trade_details.token.clone(),
            }))
            .unwrap();
        seller_balance.locked_balance -= trade_details.total_amount;
        buyer_balance.total_balance += trade_details.total_amount;
        env.storage().instance().set(
            &StorageKey::Balance(BalanceKey {
                user_address: buyer_address.clone(),
                token: trade_details.token.clone(),
            }),
            &buyer_balance,
        );
        env.storage().instance().set(
            &StorageKey::Balance(BalanceKey {
                user_address: seller_address.clone(),
                token: trade_details.token.clone(),
            }),
            &seller_balance,
        );
        trade_details.release_and_close_trade(env.ledger().timestamp());
        dispute_detail.dispute_status = DisputeStatus::Closed;
        env.storage().instance().set(
            &StorageKey::Trade(dispute_detail.bounded_trade_id.clone()),
            &trade_details,
        );
        env.storage()
            .instance()
            .set(&StorageKey::Dispute(dispute_id), &dispute_detail);
        env.storage()
            .persistent()
            .set(&StorageKey::User(buyer_address), &buyer_detail);
        env.storage()
            .persistent()
            .set(&StorageKey::User(seller_address), &seller_detail);
        Ok(dispute_detail)
    }

    pub fn send_dispute_message(
        env: Env,
        addr: Address,
        dispute_id: u128,
        msg: String,
    ) -> Result<DisputeDetails, BackendError> {
        addr.require_auth();
        let mut dispute_detail: DisputeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Dispute(dispute_id))
        {
            None => return Err(BackendError::NonExistingDisputeId),
            Some(detail) => detail,
        };
        let mods: Vec<Address> = env
            .storage()
            .persistent()
            .get(&StorageKey::Moderators)
            .unwrap_or(vec![&env]);
        if addr != dispute_detail.dispute_started_by
            && addr != dispute_detail.other_party
            && mods.contains(&addr)
        {
            return Err(BackendError::Unauthorized);
        }
        env.storage().instance().set(
            &StorageKey::DipsuteChats(DisputeChatKey {
                msg_id: dispute_detail.msg_count,
                dispute_id,
            }),
            &TradeChatDetail {
                at: env.ledger().timestamp(),
                by: addr,
                message: msg,
            },
        );
        dispute_detail.msg_count += 1;
        env.storage()
            .instance()
            .set(&StorageKey::Dispute(dispute_id), &dispute_detail);
        Ok(dispute_detail)
    }

    pub fn read_dispute_messages(
        env: Env,
        dispute_id: u128,
    ) -> Result<Vec<TradeChatDetail>, BackendError> {
        let dispute_detail: DisputeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Dispute(dispute_id))
        {
            None => return Err(BackendError::NonExistingDisputeId),
            Some(detail) => detail,
        };
        let mut starting_index = dispute_detail.msg_count;
        let mut chats = vec![&env];
        while starting_index != 0 {
            let chat: TradeChatDetail = env
                .storage()
                .instance()
                .get(&StorageKey::DipsuteChats(DisputeChatKey {
                    dispute_id,
                    msg_id: starting_index,
                }))
                .unwrap();
            chats.push_back(chat);
            starting_index -= 1;
        }
        Ok(chats)
    }

    pub fn read_dispute_message(
        env: Env,
        dispute_id: u128,
        msg_id: u32,
    ) -> Result<TradeChatDetail, BackendError> {
        match env
            .storage()
            .instance()
            .get(&StorageKey::DipsuteChats(DisputeChatKey {
                dispute_id,
                msg_id,
            })) {
            None => Err(BackendError::NonExistingChatIndex),
            Some(chat) => Ok(chat),
        }
    }

    pub fn send_trade_message(
        env: Env,
        addr: Address,
        trade_id: U256,
        msg: String,
    ) -> Result<TradeDetails, BackendError> {
        addr.require_auth();
        let mut trade_detail: TradeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Trade(trade_id.clone()))
        {
            None => return Err(BackendError::NonExistingTradeId),
            Some(detail) => detail,
        };
        if trade_detail.is_buyer(&addr) || trade_detail.is_seller(&addr) {
            env.storage().instance().set(
                &StorageKey::TradeChats(TradeChatKey {
                    trade_id: trade_id.clone(),
                    msg_id: trade_detail.msg_count,
                }),
                &TradeChatDetail {
                    message: msg,
                    at: env.ledger().timestamp(),
                    by: addr,
                },
            );
            trade_detail.increment_msg_count();
            env.storage()
                .instance()
                .set(&StorageKey::Trade(trade_id), &trade_detail);
            Ok(trade_detail)
        } else {
            Err(BackendError::Unauthorized)
        }
    }

    pub fn read_trade_messages(
        env: Env,
        trade_id: U256,
    ) -> Result<Vec<TradeChatDetail>, BackendError> {
        let trade_detail: TradeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Trade(trade_id.clone()))
        {
            None => return Err(BackendError::NonExistingTradeId),
            Some(detail) => detail,
        };
        let mut chats = vec![&env];
        let mut starting_index = trade_detail.msg_count;
        while starting_index != 0 {
            let chat: TradeChatDetail = env
                .storage()
                .instance()
                .get(&StorageKey::TradeChats(TradeChatKey {
                    msg_id: starting_index,
                    trade_id: trade_id.clone(),
                }))
                .unwrap();
            chats.push_back(chat);
            starting_index -= 1;
        }
        Ok(chats)
    }

    pub fn read_trade_message(
        env: Env,
        trade_id: U256,
        msg_id: u32,
    ) -> Result<TradeChatDetail, BackendError> {
        match env
            .storage()
            .instance()
            .get(&StorageKey::TradeChats(TradeChatKey { trade_id, msg_id }))
        {
            None => Err(BackendError::NonExistingChatIndex),
            Some(chat) => Ok(chat),
        }
    }

    pub fn notify_about_payment(
        env: Env,
        addr: Address,
        trade_id: U256,
    ) -> Result<TradeDetails, BackendError> {
        addr.require_auth();
        let mut trade_detail: TradeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Trade(trade_id.clone()))
        {
            None => return Err(BackendError::NonExistingTradeId),
            Some(detail) => detail,
        };
        if !trade_detail.is_buyer(&addr) {
            return Err(BackendError::Unauthorized);
        }
        if trade_detail.buyer_marked_paid_at.is_some() {
            return Err(BackendError::AlreadyMadePayment);
        }
        if trade_detail.status != TradeStatus::Ongoing {
            return Err(BackendError::TradeNotActive);
        }
        trade_detail.record_buyer_payment_notification(env.ledger().timestamp());
        env.storage()
            .instance()
            .set(&StorageKey::Trade(trade_id), &trade_detail);
        Ok(trade_detail)
    }

    pub fn confirm_payment(
        env: Env,
        addr: Address,
        trade_id: U256,
    ) -> Result<TradeDetails, BackendError> {
        addr.require_auth();
        let mut trade_detail: TradeDetails = match env
            .storage()
            .instance()
            .get(&StorageKey::Trade(trade_id.clone()))
        {
            None => return Err(BackendError::NonExistingTradeId),
            Some(trade_detail) => trade_detail,
        };
        if !trade_detail.is_seller(&addr) {
            return Err(BackendError::Unauthorized);
        }
        if TradeStatus::Ongoing != trade_detail.status {
            return Err(BackendError::TradeNotActive);
        }
        let mut seller_detail: UserDetail = env
            .storage()
            .persistent()
            .get(&StorageKey::User(trade_detail.seller.0.clone()))
            .unwrap();
        let index = seller_detail
            .ongoing_trades
            .binary_search(&trade_id)
            .unwrap();
        seller_detail.ongoing_trades.remove(index);
        seller_detail.past_trades.set(trade_id.clone(), ());
        let mut buyer_detail: UserDetail = env
            .storage()
            .persistent()
            .get(&StorageKey::User(trade_detail.buyer.0.clone()))
            .unwrap();
        let index = buyer_detail
            .ongoing_trades
            .binary_search(&trade_id)
            .unwrap();
        buyer_detail.ongoing_trades.remove(index);
        buyer_detail.past_trades.set(trade_id.clone(), ());
        token_transfer(
            &env,
            &trade_detail.token,
            &env.current_contract_address(),
            &trade_detail.buyer.0,
            trade_detail.total_amount,
        );
        let mut buyer_balance: BalanceDetail = env
            .storage()
            .instance()
            .get(&StorageKey::Balance(BalanceKey {
                user_address: trade_detail.buyer.0.clone(),
                token: trade_detail.token.clone(),
            }))
            .unwrap_or_default();
        let mut seller_balance: BalanceDetail = env
            .storage()
            .instance()
            .get(&StorageKey::Balance(BalanceKey {
                user_address: trade_detail.seller.0.clone(),
                token: trade_detail.token.clone(),
            }))
            .unwrap_or_default();
        buyer_balance.total_balance += trade_detail.total_amount;
        seller_balance.locked_balance -= trade_detail.total_amount;
        env.storage().instance().set(
            &StorageKey::Balance(BalanceKey {
                user_address: trade_detail.buyer.0.clone(),
                token: trade_detail.token.clone(),
            }),
            &buyer_balance,
        );
        env.storage().instance().set(
            &StorageKey::Balance(BalanceKey {
                user_address: trade_detail.seller.0.clone(),
                token: trade_detail.token.clone(),
            }),
            &seller_balance,
        );
        trade_detail.release_and_close_trade(env.ledger().timestamp());
        env.storage()
            .instance()
            .set(&StorageKey::Trade(trade_id), &trade_detail);
        env.storage().persistent().set(
            &StorageKey::User(trade_detail.seller.0.clone()),
            &seller_detail,
        );
        env.storage().persistent().set(
            &StorageKey::User(trade_detail.buyer.0.clone()),
            &buyer_detail,
        );
        Ok(trade_detail)
    }
}
