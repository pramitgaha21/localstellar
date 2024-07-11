<script lang="ts">
  import CloseTrade from '$lib/components/CloseTrade.svelte';
  import NotifySeller from '$lib/components/NotifySeller.svelte';
  import RaiseDispute from '$lib/components/RaiseDispute.svelte';
  import Release from '$lib/components/Release.svelte';
  import SendTradeMessage from '$lib/components/SendTradeMessage.svelte';
  import { onMount } from 'svelte';
  import { tradeData } from '$lib/stores/trade_detail.store';
  import { type TradeChatDetail } from 'backend';
  import { walletAddress } from '$lib/stores/profile.store';
  import { genClient } from '$lib';

  let chatDetails: TradeChatDetail[] = [];

  const readTradeMessages = async () => {
    if ($tradeData == null || $walletAddress == null) {
      return;
    }
    const backend = genClient($walletAddress);
    backend
      .read_trade_messages({
        trade_id: $tradeData.trade_id,
      })
      .then((result) => {
        if (result.result.isOk()) {
          chatDetails = result.result.unwrap();
          chatDetails.sort((a, b) => Number(b.at) - Number(a.at));
          return;
        } else {
          const error = result.result.unwrapErr();
          console.error('Error fetching chat details:', error);
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function formatDate(timestamp: bigint): string {
    return new Date(Number(timestamp)).toLocaleString();
  }

  onMount(async () => {
    await readTradeMessages();
  });
</script>

{#if $tradeData}
  <div class="trade-page">
    <div class="trade-details">
      <h1>Trade Details</h1>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="label">Trade ID</span>
          <span class="value">{$tradeData.trade_id}</span>
        </div>
        <div class="detail-item">
          <span class="label">Status</span>
          <span class="value status-{$tradeData.trade_detail.status}}">
            {$tradeData.trade_detail.status}
          </span>
        </div>
        <div class="detail-item">
          <span class="label">Type:</span>
          <span class="value"
            >{#if $tradeData.trade_detail.seller[0] == $walletAddress}Sell{:else}Buy{/if}</span
          >
        </div>
        <div class="detail-item">
          <span class="label">Started At:</span>
          <span class="value">{formatDate($tradeData.trade_detail.trade_started_at)}</span>
        </div>
        <div class="detail-item">
          <span class="label">Buyer:</span>
          <span class="value">{$tradeData.trade_detail.buyer[1]}</span>
        </div>
        <div class="detail-item">
          <span class="label">Seller:</span>
          <span class="value">{$tradeData.trade_detail.seller[1]}</span>
        </div>
        <div class="detail-item">
          <span class="label">Amount:</span>
          <span class="value"
            >{$tradeData.trade_detail.total_amount / 10000000n}
            {#if $tradeData.trade_detail.token == 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'}
              XLM
            {:else if $tradeData.trade_detail.token == 'CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR'}
              USDC
            {:else}
              $tradeData.trade_detail.token
            {/if}</span
          >
        </div>
        <div class="detail-item">
          <span class="label">Rate:</span>
          <span class="value"
            >{$tradeData.trade_detail.rate / 100}
            {$tradeData.trade_detail.currency}/{$tradeData.trade_detail.total_amount / 10000000n}
            {#if $tradeData.trade_detail.token == 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'}
              XLM
            {:else if $tradeData.trade_detail.token == 'CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR'}
              USDC
            {:else}
              $tradeData.trade_detail.token
            {/if}</span
          >
        </div>
        <div class="detail-item">
          <span class="label">Total to be paid:</span>
          <span class="value"
            >{$tradeData.trade_detail.total_amount_to_be_paid / 10000000n}
            {$tradeData.trade_detail.currency}</span
          >
        </div>
      </div>
      <div class="action-buttons">
        {#if $walletAddress == $tradeData.trade_detail.seller[0]}
          <Release tradeId={$tradeData.trade_id} />
        {:else}
          <NotifySeller tradeId={$tradeData.trade_id} />
        {/if}
        <RaiseDispute tradeId={$tradeData.trade_id} />
        <CloseTrade tradeId={$tradeData.trade_id} />
      </div>
    </div>

    <div class="chat-section">
      <h2>Trade Chat</h2>
      <div class="chat-messages">
        {#each chatDetails as chat}
          <div
            class="chat-message {chat.by === $tradeData.trade_detail.buyer[0] ? 'buyer' : 'seller'}"
          >
            <div class="message-header">
              <span class="sender"
                >{chat.by === $tradeData.trade_detail.buyer[0] ? 'Buyer' : 'Seller'}</span
              >
              <span class="time">{formatDate(chat.at)}</span>
            </div>
            <div class="message-content">{chat.message}</div>
          </div>
        {/each}
      </div>
      <SendTradeMessage tradeId={1n} />
    </div>
  </div>
{:else}
  <h1>No Trade Selected</h1>
{/if}

<style>
  :root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --background-color: #e8f4fd;
    --card-background: #ffffff;
    --text-color: #2c3e50;
    --light-text: #7f8c8d;
    --border-color: #bdc3c7;
    --shadow: 0 4px 6px rgba(52, 152, 219, 0.1);
  }

  .trade-page {
    display: flex;
    min-height: calc(100vh - 60px); /* Adjust based on your Navbar height */
    padding-top: 60px; /* Adjust based on your Navbar height */
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  .trade-details,
  .chat-section {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .trade-details {
    background-color: var(--card-background);
    box-shadow: var(--shadow);
    border-radius: 10px;
    margin-right: 1rem;
  }

  h1,
  h2 {
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .detail-item {
    background-color: var(--background-color);
    padding: 1.25rem;
    border-radius: 8px;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }

  .detail-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(52, 152, 219, 0.2);
  }

  .label {
    font-weight: 600;
    color: var(--light-text);
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9em;
    text-transform: uppercase;
  }

  .value {
    color: var(--text-color);
    font-size: 1.1em;
    font-weight: 500;
  }

  .status-ongoing {
    color: #f39c12;
  }
  .status-indispute {
    color: #e74c3c;
  }
  .status-cancelled {
    color: #95a5a6;
  }
  .status-ended {
    color: #27ae60;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-start;
    margin-top: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .chat-section {
    background-color: var(--card-background);
    border-radius: 10px;
    box-shadow: var(--shadow);
  }

  .chat-messages {
    display: flex;
    flex-direction: column-reverse;
    height: calc(100vh - 240px);
    overflow-y: auto;
    background-color: var(--background-color);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .chat-message {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 8px;
    max-width: 80%;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chat-message.buyer {
    background-color: #d6eaf8;
    align-self: flex-end;
  }

  .chat-message.seller {
    background-color: #e8f8f5;
    align-self: flex-start;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.85em;
  }

  .sender {
    font-weight: 600;
    color: var(--primary-color);
  }

  .time {
    color: var(--light-text);
  }

  .message-content {
    line-height: 1.5;
  }

  .loading {
    text-align: center;
    color: var(--light-text);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .trade-page {
      flex-direction: column;
    }

    .trade-details,
    .chat-section {
      width: 100%;
      padding: 1.5rem;
      margin-right: 0;
      margin-bottom: 1rem;
    }

    .chat-messages {
      height: 50vh;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
