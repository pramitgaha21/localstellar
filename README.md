# Local Stellar

### Missing/Unimplemented
1. Frontend
    * Serving the list of offers to the user
    * Serving the list of dispute to the moderator
    * Placing an order


### Buidling and generating `Typescript` Bindings
```bash
soroban contract build

soroban contract Bindings --contract-id XXX output-dir ./packages/backend --overwrite
```

### Deployment Guide
```bash
soroban keys generate --network testnet admin

# deploys the contract
soroban contract deploy --network testnet --wasm target/wasm32-unknown-unknown/release/backend.wasm --source-account admin

# initializes the contract
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account admin -- initialize
    --caller GCFGFFX6C23Y6WEVRDL3E4MREJI2K3DRXA3JKST3ZLW6RTBCJZ2MRSY2
    --commission 0

# adds xlm and usdc to be tradeable on the platform
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account admin -- add_token 
    --caller GCFGFFX6C23Y6WEVRDL3E4MREJI2K3DRXA3JKST3ZLW6RTBCJZ2MRSY2 
    --tokens '[ 
        "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC", # xlm contract address
        "CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR" # usdc contract address
    ]'

# registering
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account pramitgaha -- register 
    --addr GBMYU5GOKEAZ7K63IROKEY6GSJEJPKQUWRZYCYDS2QBJZJIUGKJPRNQM
    --username xlmSeller

# deposit of token
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account pramitgaha -- deposit 
    --addr GBMYU5GOKEAZ7K63IROKEY6GSJEJPKQUWRZYCYDS2QBJZJIUGKJPRNQM 
    --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC 
    --amount 1000000000

# creating an offer
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account <Account-name> -- create_offer
    --addr <Address-of-the-Account>
    --payment_methods '["Paypal", "Wire Transfer"]'
    --time_limit 30
    --currency USD
    --trade_limit '["100000000", "900000000"]'      # this is in the format of n * token's decimal, '["100000000", "900000000"]' means 10-90 xlm
    --total_amount 900000000                        # this is in the format of n * token's decimal, 900000000 means 90 XLM
    --rate 90                                       # this is in the format of n * 100, 90 means 0.09USD
    --terms '"Call me @100"'
    --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC  # address of xlm
    --offer_type Sell

# placing an order
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account <Account-name> -- place_order
    --addr <Address-of-the-Account>
    --offer_id <Offer-id>
    --amount <amount> # amount should be in format of amount * token's decimal

# sending a message for a specific trade
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account <Account-name> -- send_trade_message
    --addr <Address-of-the-Account>
    --trade_id <Trade-id>
    --msg "<Message>"

# reading the trade message
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F -- read_trade_message
    --trade_id <Trade-id>
    --msg_id <Message-index>

# buyer notifying seller about the payment
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account <Account-name> -- notify_about_payment
    --addr <Address-of-the-Account>
    --trade_id <Trade-id>

# seller confirming about the payment
soroban contract invoke --id CBNW6WIJYHQ5JP5WE3PGZGSD7W5ASYOMUMTJWYXGSGSEQP7QBCVCIY2F --source-account <Account-name> -- confirm_payment
    --addr <Address-of-the-Account>
    --trade_id <Trade-id>
```


