<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  export let token: string;
  let amount: number;
  let showPrompt = false;

  const openPrompt = () => {
    showPrompt = true;
  };

  const closePrompt = () => {
    showPrompt = false;
    amount = 0;
  };

  const deposit = async () => {
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
    console.log('amount before deposit function is called', BigInt(amount * 10000000));
    const tx = await backend.deposit({
      addr: $walletAddress,
      token,
      amount: BigInt(amount * 10000000),
    });
    tx.signAndSend({
      signTransaction,
    })
      .then((result) => {
        if (result.result.isOk()) {
          modalMessage.set({
            show: true,
            title: 'Successfully Deposited',
            message: 'Deposit Successful',
            type: 'success',
          });
          return;
        } else {
          modalMessage.set({
            show: true,
            title: 'Deposit Failed',
            message: result.result.unwrapErr().message,
            type: 'error',
          });
          return;
        }
      })
      .catch((err) => {
        modalMessage.set({
          show: true,
          title: 'Deposit Failed',
          message: err,
          type: 'error',
        });
      });
    closePrompt();
  };
</script>

<button on:click={openPrompt} class="open-button">Deposit</button>

{#if showPrompt}
  <div class="prompt-overlay">
    <div class="prompt-content">
      <h2>Enter Deposit Amount</h2>
      <input type="number" bind:value={amount} placeholder="Enter amount" />
      <div class="button-group">
        <button on:click={closePrompt} class="cancel-button">Cancel</button>
        <button on:click={deposit} class="confirm-button">Confirm Deposit</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .open-button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }

  .prompt-overlay {
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

  .prompt-content {
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
    .prompt-content {
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
