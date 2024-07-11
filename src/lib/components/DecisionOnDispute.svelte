<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  export let disputeId: bigint;
  let decision: number = 0;
  let showModal = false;

  const decisionOnDispute = async () => {
    if ($walletAddress == null) {
      modalMessage.set({
        show: true,
        title: 'Wallet not Connected',
        message: 'Please connect your wallet',
        type: 'error',
      });
      return;
    }
    const backend = genClient($walletAddress);
    const tx = await backend.mod_decision_on_dispute({
      addr: $walletAddress,
      dispute_id: disputeId,
      decision,
    });
    tx.signAndSend({
      signTransaction,
    })
      .then((result) => {
        if (result.result.isOk()) {
          modalMessage.set({
            show: true,
            title: 'Successfully Decision Provided',
            message: 'Successfully Decision Provided',
            type: 'success',
          });
          closeModal();
          return;
        } else {
          modalMessage.set({
            show: true,
            title: 'Failed to Provide Decision',
            message: result.result.unwrapErr().message,
            type: 'error',
          });
          closeModal();
          return;
        }
      })
      .catch((err) => {
        modalMessage.set({
          show: true,
          message: err,
          title: 'Failed to Provided Decision',
          type: 'error',
        });
      });
    closeModal();
  };

  const openModal = () => {
    showModal = true;
  };

  const closeModal = () => {
    showModal = false;
    decision = 0;
  };

  const handleConfirm = () => {
    if (decision !== null) {
      decisionOnDispute();
    } else {
      alert('Please select an option before confirming.');
    }
  };
</script>

<button class="decision-button" on:click={openModal}>Make Decision</button>

{#if showModal}
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Select Decision</h2>
      <div class="options">
        <label class="radio-label">
          <input type="radio" bind:group={decision} value={0} />
          <span class="radio-custom"></span>
          Release to Buyer
        </label>
        <label class="radio-label">
          <input type="radio" bind:group={decision} value={1} />
          <span class="radio-custom"></span>
          Release to Seller
        </label>
      </div>
      <div class="buttons">
        <button class="button confirm" on:click={handleConfirm}>Confirm</button>
        <button class="button cancel" on:click={closeModal}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .decision-button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  .decision-button:hover {
    background-color: #45a049;
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
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
  }

  h2 {
    margin-top: 0;
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
  }

  .options {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
  }

  .radio-label {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    cursor: pointer;
    font-size: 18px;
  }

  .radio-label input[type='radio'] {
    display: none;
  }

  .radio-custom {
    width: 20px;
    height: 20px;
    border: 2px solid #4caf50;
    border-radius: 50%;
    margin-right: 10px;
    position: relative;
  }

  .radio-custom::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #4caf50;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s;
  }

  .radio-label input[type='radio']:checked + .radio-custom::after {
    transform: translate(-50%, -50%) scale(1);
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  .confirm {
    background-color: #4caf50;
    color: white;
  }

  .confirm:hover {
    background-color: #45a049;
  }

  .cancel {
    background-color: #f44336;
    color: white;
  }

  .cancel:hover {
    background-color: #d32f2f;
  }
</style>
