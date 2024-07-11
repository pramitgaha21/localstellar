<script lang="ts">
  import { profile, walletAddress } from '$lib/stores/profile.store';
  import Deposit from '$lib/components/Deposit.svelte';
  import Withdraw from '$lib/components/Withdraw.svelte';
  import type { BalanceDetail, OfferDetail, OfferType, TradeDetails, TradeStatus } from 'backend';
  import { goto } from '$app/navigation';
  import { tradeData } from '$lib/stores/trade_detail.store';
  import { disputeData } from '$lib/stores/dispute_detail.store';
  import { onMount } from 'svelte';
  import Register from '$lib/components/Register.svelte';
  import CreateOffer from '$lib/components/CreateOffer.svelte';
  import backend from '../../contracts/backend';
  import { modalMessage } from '$lib/stores/modal.store';

  let showTooltip = false;
  let tooltipX = 0;
  let tooltipY = 0;
  let ongoingOffers: Map<bigint, OfferDetail> = new Map();
  let ongoingTrades: Map<bigint, TradeDetails> = new Map();
  let pastTrades: Map<bigint, TradeDetails> = new Map();

  $: reactiveOngoingOffers = Array.from(ongoingOffers);
  $: reactiveOngoingTrades = Array.from(ongoingTrades);
  $: reactivePastTrades = Array.from(pastTrades);

  function handleMouseEnter(event: MouseEvent) {
    showTooltip = true;
    updateTooltipPosition(event);
  }

  function handleMouseLeave() {
    showTooltip = false;
  }

  function handleMouseMove(event: MouseEvent) {
    updateTooltipPosition(event);
  }

  function updateTooltipPosition(event: MouseEvent) {
    tooltipX = event.clientX + 10;
    tooltipY = event.clientY + 10;
  }

  function calculateAvailableBalance(detail: BalanceDetail): string {
    return (
      (BigInt(detail.total_balance) -
        BigInt(detail.freezed_balance) -
        BigInt(detail.locked_balance)) /
      10000000n
    ).toString();
  }

  function calculateSuccessRate(success: bigint, unsuccessful: bigint): number {
    const total = Number(success) + Number(unsuccessful);
    return total > 0 ? (Number(success) / Number(total)) * 100 : 0;
  }

  function getOfferTypeLabel(offerType: OfferType) {
    return offerType.tag === 'Buy' ? 'Buy' : 'Sell';
  }

  function getOfferTypeColor(offerType: OfferType) {
    return offerType.tag === 'Buy' ? 'green' : 'red';
  }

  function getStatusLabel(status: TradeStatus) {
    return status.tag;
  }

  function getStatusColor(status: TradeStatus) {
    switch (status.tag) {
      case 'Ongoing':
        return 'yellow';
      case 'InDispute':
        return 'grey';
      case 'Cancelled':
        return 'red';
      case 'Ended':
        return 'green';
      default:
        return 'black';
    }
  }

  function formatDate(timestamp: bigint) {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  }

  const viewDisputeDetail = async (disputeId: bigint | undefined) => {
    if (disputeId == undefined || $walletAddress == null) {
      return;
    } else {
      backend
        .get_dispute_detail({ addr: $walletAddress, id: disputeId })
        .then((result) => {
          if (result.result.isOk()) {
            disputeData.set({
              dispute_id: disputeId,
              dispute_detail: result.result.unwrap(),
            });
            goto('/dispute');
          } else {
            modalMessage.set({
              show: true,
              title: 'Failed to get dispute detail',
              message: 'Failed to get dispute detail',
              type: 'error',
            });
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          modalMessage.set({
            show: true,
            title: 'Failed to get dispute detail',
            message: 'Failed to get dispute detail',
            type: 'error',
          });
        });
    }
  };

  const viewTradeDetail = (tradeId: bigint, tradeDetail: TradeDetails) => {
    tradeData.set({
      trade_id: tradeId,
      trade_detail: tradeDetail,
    });
    goto(`/trade`);
  };

  function copyToClipboard(address: string) {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        alert('Wallet address copied to clipboard!');
        // Alternatively, you could use a more subtle notification method
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }

  onMount(() => {
    if ($walletAddress) {
      console.log('calling from mount');
      backend
        .my_offer_list({ addr: $walletAddress })
        .then((result) => {
          console.log('offer fetched');
          if (result.result.isOk()) {
            console.log(result.result.unwrap());
            ongoingOffers = result.result.unwrap();
          } else {
            console.log('error while fetching offers', result.result.unwrapErr());
          }
        })
        .catch((err) => {
          console.log(err);
        });
      backend.my_active_trade_list({ addr: $walletAddress }).then((result) => {
        if (result.result.isOk()) {
          ongoingTrades = result.result.unwrap();
        }
      });
      backend.my_past_trade_list({ addr: $walletAddress }).then((result) => {
        if (result.result.isOk()) {
          pastTrades = result.result.unwrap();
        }
      });
    } else {
      return;
    }
  });
</script>

{#if $profile && $walletAddress}
  <div class="profile">
    <h2>{$profile.username}</h2>
    <div class="wallet-address">
      <p>
        Wallet Address: <span class="address">{$walletAddress}</span>
        <button
          class="copy-button"
          on:click={() => {
            copyToClipboard($walletAddress);
          }}
          aria-label="Copy wallet address"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </p>
    </div>
    <p>Registered at: {new Date(Number($profile.registered_at) * 1000).toLocaleString()}</p>

    <div class="trade-stats">
      <div
        class="progress-bar"
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        on:mousemove={handleMouseMove}
      >
        <div
          class="success"
          style="width: {calculateSuccessRate(
            $profile.no_of_successful_trades,
            $profile.no_of_unsuccessful_trades,
          )}%"
        ></div>
      </div>
      {#if showTooltip}
        <div class="tooltip" style="left: {tooltipX}px; top: {tooltipY}px;">
          {$profile.no_of_successful_trades}/{$profile.no_of_unsuccessful_trades}
        </div>
      {/if}
    </div>

    <h3>Balances</h3>
    {#each [...$profile.balance] as [token, detail]}
      <div class="balance-item">
        <h4>
          {#if token == 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'}
            XLM
          {:else if token == 'CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR'}
            USDC
          {:else}
            {token}
          {/if}
        </h4>
        <p>Total Balance: {detail.total_balance / 10000000n}</p>
        <p>Freezed Balance: {detail.freezed_balance / 10000000n}</p>
        <p>Locked Balance: {detail.locked_balance / 10000000n}</p>
        <p>Available Balance: {calculateAvailableBalance(detail)}</p>
        <div class="actions">
          <Withdraw {token} />
          <Deposit {token} />
        </div>
      </div>
    {/each}

    <h3>Ongoing Offers</h3>
    <CreateOffer />
    {#if reactiveOngoingOffers.length > 0}
      <div class="offers-container">
        {#each [...reactiveOngoingOffers] as [offerId, offerDetail]}
          <div class="offer-item">
            <div class="offer-header">
              <span class="offer-id">Offer ID: {offerDetail.offer_id.toString()}</span>
              <span
                class="offer-type-label"
                style="background-color: {getOfferTypeColor(offerDetail.offer_type)}"
              >
                {getOfferTypeLabel(offerDetail.offer_type)}
              </span>
            </div>
            <p>Currency: {offerDetail.currency}</p>
            <p>
              Token:{#if offerDetail.token == 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'}
                XLM
              {:else if offerDetail.token == 'CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR'}
                USDC
              {/if}
            </p>
            <p>Rate: {offerDetail.rate / 100}</p>
            <p>Total Tradeable Amount: {offerDetail.total_tradeable_amount / 10000000n}</p>
            <p>
              Trade Limit: {offerDetail.trade_limit[0] / 10000000n} - {offerDetail.trade_limit[1] /
                10000000n}
            </p>
            <p>Time Limit: {offerDetail.time_limit} minutes</p>
            <p>Accepted Payment Methods: {offerDetail.accepted_payment_methods.join(', ')}</p>
            <p>Terms: {offerDetail.terms}</p>
          </div>
        {/each}
      </div>
    {:else}
      <p>No ongoing offers at the moment.</p>
    {/if}

    <h3>Ongoing Trades</h3>
    {#if reactiveOngoingTrades.length > 0}
      <div class="trades-container">
        {#each [...reactiveOngoingTrades] as [tradeId, tradeDetails]}
          <div class="trade-item">
            <div class="trade-header">
              <span class="trade-id">Trade ID: {tradeId.toString()}</span>
              <span
                class="trade-status-label"
                style="background-color: {getStatusColor(tradeDetails.status)}"
              >
                {getStatusLabel(tradeDetails.status)}
              </span>
            </div>
            <p>Offer ID: {tradeDetails.bounded_offer_id.toString()}</p>
            <p>Started: {formatDate(tradeDetails.trade_started_at)}</p>
            <p>Buyer: {tradeDetails.buyer[1]}</p>
            <p>Seller: {tradeDetails.seller[1]}</p>
            <p>
              Token: {#if tradeDetails.token == 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'}
                XLM
              {:else if tradeDetails.token == 'CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR'}
                USDC
              {:else}
                {tradeDetails.token}
              {/if}
            </p>
            <p>Amount: {tradeDetails.total_amount / 10000000n}</p>
            <p>To Pay: {tradeDetails.total_amount_to_be_paid / 100n} {tradeDetails.currency}</p>
            <p>Rate: {tradeDetails.rate / 100} {tradeDetails.currency}/{tradeDetails.token}</p>
            {#if tradeDetails.buyer_marked_paid_at}
              <p>Marked Paid: {formatDate(tradeDetails.buyer_marked_paid_at)}</p>
            {/if}
            {#if tradeDetails.seller_released_at}
              <p>Released: {formatDate(tradeDetails.seller_released_at)}</p>
            {/if}
            <div class="trade-actions">
              {#if tradeDetails.dispute_id}
                <button
                  class="action-button dispute"
                  on:click={() => viewDisputeDetail(tradeDetails.dispute_id)}
                >
                  View Dispute Detail
                </button>
              {/if}
              <button
                class="action-button trade"
                on:click={() => viewTradeDetail(tradeId, tradeDetails)}
              >
                View Trade Detail
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p>No ongoing trades at the moment.</p>
    {/if}

    <h3>Past Trades</h3>
    {#if reactivePastTrades.length > 0}
      <div class="trades-container">
        {#each [...reactivePastTrades] as [tradeId, tradeDetails]}
          <div class="trade-item">
            <div class="trade-header">
              <span class="trade-id">Trade ID: {tradeId.toString()}</span>
              <span
                class="trade-status-label"
                style="background-color: {getStatusColor(tradeDetails.status)}"
              >
                {getStatusLabel(tradeDetails.status)}
              </span>
            </div>
            <p>Offer ID: {tradeDetails.bounded_offer_id.toString()}</p>
            <p>Buyer: {tradeDetails.buyer[1]}</p>
            <p>Seller: {tradeDetails.seller[1]}</p>
            <p>
              Token: Token: {#if tradeDetails.token == 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'}
                XLM
              {:else if tradeDetails.token == 'CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR'}
                USDC
              {:else}
                {tradeDetails.token}
              {/if}
            </p>
            <p>Amount: {tradeDetails.total_amount / 10000000n}</p>
            <p>To Pay: {tradeDetails.total_amount_to_be_paid / 100n} {tradeDetails.currency}</p>
            <p>Rate: {tradeDetails.rate / 100} {tradeDetails.currency}/{tradeDetails.token}</p>
            <p>Started: {formatDate(tradeDetails.trade_started_at)}</p>
            {#if tradeDetails.buyer_marked_paid_at}
              <p>Marked Paid: {formatDate(tradeDetails.buyer_marked_paid_at)}</p>
            {/if}
            {#if tradeDetails.seller_released_at}
              <p>Released: {formatDate(tradeDetails.seller_released_at)}</p>
            {/if}
            {#if tradeDetails.dispute_id}
              <p>Dispute ID: {tradeDetails.dispute_id.toString()}</p>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <p>No ongoing trades at the moment.</p>
    {/if}
  </div>
{:else}
  <div class="registration-container">
    <h2 class="registration-header">No Profile Found, Try registering</h2>
    <Register />
  </div>
{/if}

<style>
  .profile {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .profile h2 {
    color: #333;
    margin-bottom: 10px;
  }

  .profile h3 {
    color: #555;
    margin-top: 20px;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }

  .profile p {
    margin: 5px 0;
    color: #666;
  }

  .trade-stats {
    margin: 20px 0;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    background-color: #ff6b6b;
    position: relative;
    cursor: pointer;
    border-radius: 10px;
    overflow: hidden;
  }

  .success {
    height: 100%;
    background-color: #51cf66;
    transition: width 0.3s ease;
  }

  .tooltip {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    pointer-events: none;
    z-index: 1000;
  }

  .balance-item {
    margin-bottom: 20px;
    background-color: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .balance-item h4 {
    color: #333;
    margin-bottom: 10px;
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  .offers-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .offer-item {
    background-color: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .offer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .offer-id {
    font-weight: bold;
  }

  .offer-type-label {
    padding: 3px 8px;
    border-radius: 12px;
    color: white;
    font-size: 0.8em;
    font-weight: bold;
  }

  .offer-item p {
    margin: 5px 0;
  }

  .trades-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .trade-item {
    background-color: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .trade-id {
    font-weight: bold;
  }

  .trade-status-label {
    padding: 3px 8px;
    border-radius: 12px;
    color: white;
    font-size: 0.8em;
    font-weight: bold;
  }

  .trade-item p {
    margin: 5px 0;
  }

  .trade-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .action-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button.dispute {
    background-color: #f0ad4e;
    color: white;
  }

  .action-button.dispute:hover {
    background-color: #ec971f;
  }

  .action-button.trade {
    background-color: #5bc0de;
    color: white;
  }

  .action-button.trade:hover {
    background-color: #31b0d5;
  }

  /* Responsive design for mobile */
  @media (max-width: 600px) {
    .trade-actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
      margin-bottom: 10px;
    }
  }

  .registration-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .registration-header {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  :global(.registration-container .register-form) {
    display: flex;
    flex-direction: column;
  }

  :global(.registration-container input) {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
  }

  :global(.registration-container button) {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  :global(.registration-container button:hover) {
    background-color: #0056b3;
  }
</style>
