use soroban_sdk::{contracttype, Address, Map, String, Symbol, Vec, U256};

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct BalanceKey {
    pub user_address: Address,
    pub token: Address,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug, Default)]
pub struct BalanceDetail {
    pub total_balance: i128,
    pub locked_balance: i128,
    pub freezed_balance: i128,
}

#[contracttype]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum UserStatus {
    Blacklisted,
    Whitelisted,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct UserDetail {
    pub username: Symbol,
    pub registered_at: u64,
    pub status: UserStatus,
    pub no_of_successful_trades: u128,
    pub no_of_unsuccessful_trades: u128,
    pub ongoing_trades: Vec<U256>,
    pub past_trades: Map<U256, ()>,
    pub ongoing_offers: Vec<U256>,
}

impl From<(UserDetail, Map<Address, BalanceDetail>)> for LoggedProfile {
    fn from(
        (
            UserDetail {
                username,
                registered_at,
                no_of_successful_trades,
                no_of_unsuccessful_trades,
                status,
                ongoing_trades,
                past_trades,
                ongoing_offers,
            },
            balance,
        ): (UserDetail, Map<Address, BalanceDetail>),
    ) -> Self {
        Self {
            username,
            registered_at,
            status,
            no_of_successful_trades,
            no_of_unsuccessful_trades,
            ongoing_trades,
            past_trades: past_trades.keys(),
            ongoing_offers,
            balance,
        }
    }
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct LoggedProfile {
    pub username: Symbol,
    pub registered_at: u64,
    pub status: UserStatus,
    pub no_of_unsuccessful_trades: u128,
    pub no_of_successful_trades: u128,
    pub ongoing_offers: Vec<U256>,
    pub past_trades: Vec<U256>,
    pub ongoing_trades: Vec<U256>,
    pub balance: Map<Address, BalanceDetail>,
}

#[contracttype]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum OfferType {
    Buy,
    Sell,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct OfferDetail {
    pub offer_by: (Address, Symbol),
    pub offer_id: U256,
    pub token: Address,
    pub rate: u32,
    pub currency: Symbol,
    pub total_tradeable_amount: i128,
    pub offer_type: OfferType,
    pub accepted_payment_methods: Vec<String>,
    pub time_limit: u32,
    pub trade_limit: (i128, i128),
    pub terms: String,
}

#[contracttype]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum TradeStatus {
    Ongoing,
    InDispute,
    Cancelled,
    Ended,
}

#[contracttype]
pub struct TradeDetails {
    pub bounded_offer_id: U256,
    pub trade_started_at: u64,
    pub dispute_id: Option<u128>,
    pub status: TradeStatus,
    pub buyer: (Address, Symbol),
    pub seller: (Address, Symbol),
    pub total_amount: i128,
    pub token: Address,
    pub currency: Symbol,
    pub rate: u32,
    pub total_amount_to_be_paid: u128,
    pub buyer_marked_paid_at: Option<u64>,
    pub seller_released_at: Option<u64>,
    pub msg_count: u32,
}

impl TradeDetails {
    pub fn is_seller(&self, caller: &Address) -> bool {
        self.seller.0 == *caller
    }

    pub fn is_buyer(&self, caller: &Address) -> bool {
        self.buyer.0 == *caller
    }

    pub fn increment_msg_count(&mut self) {
        self.msg_count += 1;
    }

    pub fn record_buyer_payment_notification(&mut self, current_time: u64) {
        self.buyer_marked_paid_at = Some(current_time);
    }

    pub fn release_and_close_trade(&mut self, current_time: u64) {
        self.seller_released_at = Some(current_time);
        self.status = TradeStatus::Ended;
    }
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct TradeChatKey {
    pub msg_id: u32,
    pub trade_id: U256,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct TradeChatDetail {
    pub by: Address,
    pub at: u64,
    pub message: String,
}

#[contracttype]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum DisputeStatus {
    Ongoing,
    WaitingApproval,
    Rejected,
    Closed,
}

#[contracttype]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum Decision {
    ReleaseToBuyer = 0,
    ReleaseToSeller = 1,
}

impl Decision {
    pub fn from_u32(val: u32) -> Self {
        match val {
            0 => Self::ReleaseToBuyer,
            1 => Self::ReleaseToSeller,
            _ => panic!("invalid number"),
        }
    }
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct DisputeDetails {
    pub created_at: u64,
    pub bounded_trade_id: U256,
    pub msg_count: u32,
    pub is_claim_approved: Option<bool>,
    pub dispute_started_by: Address,
    pub other_party: Address,
    pub dispute_status: DisputeStatus,
    pub decision: Option<u32>,
    pub ended_at: Option<u64>,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct DisputeChatKey {
    pub msg_id: u32,
    pub dispute_id: u128,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum StorageKey {
    Admin,         // => Address
    Commission,    // => u32
    Moderators,    // => Vec<Address>
    AllowedTokens, // => Vec<Address>
    User(Address),
    Balance(BalanceKey),
    Offer(U256),
    Trade(U256),
    Dispute(u128),
    TradeChats(TradeChatKey),
    DipsuteChats(DisputeChatKey),
    TradeCount,
    OfferCount,
    DisputeCount,
}
