<script lang="ts">
  import { disputeData } from '$lib/stores/dispute_detail.store';
  import { type TradeChatDetail } from 'backend';
  import backend from '../../contracts/backend';
  import SendDisputeMessage from '$lib/components/SendDisputeMessage.svelte';
  import DecisionOnClaimApproval from '$lib/components/DecisionOnClaimApproval.svelte';
  import DecisonOnDispute from '$lib/components/DecisionOnDispute.svelte';
  import { walletAddress } from '$lib/stores/profile.store';
  import { onMount } from 'svelte';
  import { modalMessage } from '$lib/stores/modal.store';

  let chats: TradeChatDetail[] = [];

  function getDecisionText(decision: number | undefined): string {
    if (decision === undefined) {
      return 'No decision yet';
    } else if (decision === 0) {
      return 'Release to Buyer';
    } else if (decision === 1) {
      return 'Release to Seller';
    } else {
      return 'Invalid Decision Provided';
    }
  }

  function formatTimestamp(timestamp: bigint | undefined): string {
    return timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : 'N/A';
  }

  const fetchChats = async () => {
    if ($disputeData?.dispute_id == null) {
      return;
    }
    backend
      .read_dispute_messages({ dispute_id: $disputeData?.dispute_id })
      .then((result) => {
        if (result.result.isOk()) {
          chats = result.result.unwrap();
          return;
        } else {
          modalMessage.set({
            show: true,
            title: 'Invalid Dispute Id',
            message: 'Invalid Dispute Id',
            type: 'error',
          });
          return;
        }
      })
      .catch((err) => {
        modalMessage.set({
          show: true,
          title: 'Invalid Dispute Id',
          message: err.toString(),
          type: 'error',
        });
        return;
      });
  };

  onMount(async () => {
    await fetchChats();
  });
</script>

<div class="dispute-page">
  {#if $disputeData}
    <div class="dispute-details">
      <h1>Dispute Details</h1>
      <p><strong>Created At:</strong> {formatTimestamp($disputeData.dispute_detail.created_at)}</p>
      <p><strong>Status:</strong> {$disputeData.dispute_detail.dispute_status.tag}</p>
      <p><strong>Started By:</strong> {$disputeData.dispute_detail.dispute_started_by}</p>
      <p><strong>Other Party:</strong> {$disputeData.dispute_detail.other_party}</p>
      <p><strong>Decision:</strong> {getDecisionText($disputeData.dispute_detail.decision)}</p>
      <p><strong>Ended At:</strong> {formatTimestamp($disputeData.dispute_detail.ended_at)}</p>
      <p>
        <strong>Claim Approved:</strong>
        {$disputeData.dispute_detail.is_claim_approved?.toString() ?? 'N/A'}
      </p>
      {#if $walletAddress}
        {#if $walletAddress != $disputeData.dispute_detail.dispute_started_by && $walletAddress != $disputeData.dispute_detail.other_party}
          {#if $disputeData.dispute_detail.is_claim_approved == null}
            <DecisionOnClaimApproval disputeId={$disputeData.dispute_id} />
          {:else}
            <DecisonOnDispute disputeId={$disputeData.dispute_id} />
          {/if}
        {/if}
      {/if}
    </div>
    <div class="chat-messages">
      <h2>Chat Messages</h2>
      {#if chats.length > 0}
        <ul>
          {#each chats as chat}
            <li>
              <span class="timestamp">{formatTimestamp(chat.at)}</span>
              <span class="sender">{chat.by}:</span>
              <span class="message">{chat.message}</span>
            </li>
          {/each}
        </ul>
      {:else}
        <p>No chat messages available.</p>
      {/if}
      <SendDisputeMessage disputeId={$disputeData.dispute_id} />
    </div>
  {:else}
    <div class="no-data">
      <p>No dispute data available.</p>
    </div>
  {/if}
</div>

<style>
  .dispute-page {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .dispute-details,
  .chat-messages {
    flex: 1;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1,
  h2 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  strong {
    color: #555;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    background-color: #fff;
    border-radius: 4px;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .timestamp {
    font-size: 0.8rem;
    color: #888;
    display: block;
    margin-bottom: 0.25rem;
  }

  .sender {
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .no-data {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
    padding: 2rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .dispute-page {
      flex-direction: column;
    }
  }
</style>
