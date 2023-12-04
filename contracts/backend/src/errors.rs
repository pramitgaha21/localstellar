use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
#[repr(u32)]
pub enum BackendError{
    Uninitialized = 0,
    ContractAlreadyInitialized = 1,
    UsernameTaken = 2,
    UserAlreadyRegistered = 3,
    UserNotRegisted = 4,
}