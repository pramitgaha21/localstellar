<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  export let tradeId: bigint;

  const notifySeller = async () => {
    if ($walletAddress == null) {
      modalMessage.set({
        show: true,
        title: 'Wallet not Connected',
        message: 'Please Connect your wallet',
        type: 'info',
      });
      return;
    }

    const backend = genClient($walletAddress);

    const tx = await backend.notify_about_payment({ addr: $walletAddress, trade_id: tradeId });
    const result = tx.signAndSend({
      signTransaction,
    });
    console.log(result);
  };
</script>

<button class="notify-button" on:click={notifySeller}>Notify Seller about Payment</button>

<style>
  .notify-button {
    background-color: #4caf50;
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

  .notify-button:hover {
    background-color: #45a049;
  }

  .notify-button:active {
    background-color: #3e8e41;
  }
</style>
