<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  export let tradeId: bigint;

  const release = async () => {
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
    const tx = await backend.confirm_payment({ addr: $walletAddress, trade_id: tradeId });
    const result = await tx.signAndSend({ signTransaction });
    console.log(result);
  };
</script>

<button class="release-trade-button" on:click={release}>Payment Received, Release</button>

<style>
  .release-trade-button {
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

  .release-trade-button:hover {
    background-color: #45a049;
  }

  .release-trade-button:active {
    background-color: #3e8e41;
  }
</style>
