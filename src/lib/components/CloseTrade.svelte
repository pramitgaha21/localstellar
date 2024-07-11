<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  export let tradeId: bigint;

  const closeTrade = async () => {
    if ($walletAddress == null) {
      modalMessage.set({
        show: true,
        title: 'Wallet not Connected',
        message: 'Please Connect your wallet and trying registering',
        type: 'info',
      });
      return;
    }

    const backend = genClient($walletAddress);

    const tx = await backend.close_trade({ addr: $walletAddress, trade_id: tradeId });
    tx.signAndSend({
      signTransaction,
    })
      .then((result) => {
        if (result.result.isOk()) {
          modalMessage.set({
            show: true,
            title: 'Successfully Closed',
            message: 'Trade Successfully Closed',
            type: 'info',
          });
          return;
        } else {
          modalMessage.set({
            show: true,
            title: 'Failed to close trade',
            message: result.result.unwrapErr().message,
            type: 'error',
          });
          return;
        }
      })
      .catch((err) => {
        modalMessage.set({
          show: true,
          title: 'Failed to close trade',
          message: err,
          type: 'error',
        });
        return;
      });
  };
</script>

<button class="close-trade-button" on:click={closeTrade}>Close Trade</button>

<style>
  .close-trade-button {
    background-color: red;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .close-trade-button:hover {
    background-color: #45a049;
  }

  .close-trade-button:active {
    background-color: #3e8e41;
  }
</style>
