<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  export let offer_id: bigint;
  export let offer_type: 'Buy' | 'Sell';

  let amount: bigint;
  let showModal = false;

  const openModal = () => {
    showModal = true;
  };

  const closeModal = () => {
    showModal = false;
    amount = 0n;
  };

  const placeOrder = async () => {
    closeModal();
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
    const tx = await backend.place_order({ addr: $walletAddress, offer_id, amount });
    const result = await tx.signAndSend({
      signTransaction,
    });
    console.log(result);
  };
</script>

<button on:click={openModal} class="place-order-button">Place Order</button>

{#if showModal}
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>{offer_type === 'Buy' ? 'Buy' : 'Sell'} Order</h2>
      <p>Enter the amount you want to {offer_type}:</p>
      <input type="number" bind:value={amount} placeholder="Enter amount" />
      <div class="button-group">
        <button on:click={closeModal} class="cancel-button">Cancel</button>
        <button on:click={placeOrder} class="confirm-button">Place Order</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .place-order-button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    width: 300px;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.2em;
  }

  p {
    margin-bottom: 15px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }

  .cancel-button,
  .confirm-button {
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .cancel-button {
    background-color: #f44336;
    color: white;
  }

  .confirm-button {
    background-color: #4caf50;
    color: white;
  }

  @media (max-width: 400px) {
    .modal-content {
      width: 90%;
    }

    .button-group {
      flex-direction: column;
      gap: 10px;
    }

    .cancel-button,
    .confirm-button {
      width: 100%;
    }
  }
</style>
