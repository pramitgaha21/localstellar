use soroban_sdk::{contracttype, Address, U256, Vec, Map, Symbol};

#[contracttype]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
#[repr(u32)]
pub enum ModeratorStatus{
    Pending,
    Active,
    Blacklisted,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct ModeratorDetail{
    pub registered_at: u64,
    pub id: u32,
    pub username:Symbol,
    pub address: Address,
    pub status: ModeratorStatus,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct BalanceKey{
    pub user: Address,
    pub token: Address,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct Blocked{
    pub amount_blocked: U256,
    pub blocked_at: u64,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum UserStatus{
    Blocked(Blocked),
    Whitelisted,
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct UserDetail{
    // user name of the user
    pub username: Symbol,
    // address of the user
    pub addr: Address,
    // user registered at
    pub registered_at: u64,
    // status of the user
    pub status: UserStatus,
    // list of ongoing orders, user can have orders more than 20 at a time
    pub ongoing_orders: Vec<U256>,
    // list of orders completed in the past by user
    pub past_orders: Map<U256, ()>,
}

#[contracttype]
pub struct LoginProfile{
    // user name of the user
    pub username: Symbol,
    pub addr: Address,
    // user registered at
    pub registered_at: u64,
    // status of the user
    pub status: UserStatus,
    // list of ongoing orders, user can have orders more than 20 at a time
    pub ongoing_orders: Vec<U256>,
    // list of orders completed in the past by user
    pub past_orders: Map<U256, ()>,
    // mapping of balance of the user
    pub balances: Map<Address, U256>,
}

#[contracttype]
pub struct UserProfile{
        // user name of the user
        pub username: Symbol,
        // address of the user
        pub addr: Address,
        // user registered at
        pub registered_at: u64,
        // status of the user
        pub status: UserStatus,
        // list of orders completed in the past by user
        pub past_orders: Map<U256, ()>,
}

impl From<UserDetail> for UserProfile{
    fn from(value: UserDetail) -> Self {
        Self{
            username: value.username,
            addr: value.addr,
            registered_at: value.registered_at,
            status: value.status,
            past_orders: value.past_orders,
        }
    }
}

#[contracttype]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum StorageKey{
    Initialized,
    AdFee,
    TradeCommission,
    Moderators,
    Administrator,
    User(Address),
    Username(Symbol),
    Balance(BalanceKey),
    AllowedTokens,
}