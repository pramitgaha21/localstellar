<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';

  const { signTransaction } = pkg;

  export let tradeId: bigint;
  let msg: string;

  const sendMessage = async () => {
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

    const tx = await backend.send_trade_message({ addr: $walletAddress, trade_id: tradeId, msg });
    const result = await tx.signAndSend({
      signTransaction,
    });
    console.log(result);
  };
</script>

<div class="message-input-container">
  <textarea bind:value={msg} placeholder="Type your message here..." rows="3" class="message-input"
  ></textarea>
  <button on:click={sendMessage} class="send-button">Send</button>
</div>

<style>
  .message-input-container {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    max-width: 600px;
    margin: 0 auto;
  }

  .message-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
    resize: vertical;
    min-height: 60px;
    max-height: 200px;
  }

  .send-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
  }

  .send-button:hover {
    background-color: #45a049;
  }

  .send-button:active {
    background-color: #3d8b40;
  }

  @media (max-width: 480px) {
    .message-input-container {
      flex-direction: column;
    }

    .send-button {
      width: 100%;
    }
  }
</style>
