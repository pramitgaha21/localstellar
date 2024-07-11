<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  export let tradeId: bigint;

  const raiseDispute = async () => {
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
    const tx = await backend.raise_dispute({ addr: $walletAddress, trade_id: tradeId });
    const result = await tx.signAndSend({ signTransaction });
    console.log(result);
  };
</script>

<button on:click={raiseDispute} class="raise-dispute-button">Raise Dispute</button>

<style>
  .raise-dispute-button {
    background-color: #ff9800; /* Orange color */
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .raise-dispute-button:hover {
    background-color: #f57c00; /* Darker orange on hover */
  }

  .raise-dispute-button:active {
    background-color: #e65100; /* Even darker orange when clicked */
  }

  .raise-dispute-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.5); /* Orange glow on focus */
  }
</style>
