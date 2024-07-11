<script lang="ts">
  import { onMount } from 'svelte';
  import PlaceOrder from '$lib/components/PlaceOrder.svelte';
  import type { OfferDetail } from 'backend';
  import backend from '../../contracts/backend';

  let offers: Map<bigint, OfferDetail>;
  let filteredOffers: OfferDetail[] = [];
  let filterType: 'All' | 'Buy' | 'Sell' = 'All';

  onMount(async () => {
    const { result } = await backend.offer_list();
    offers = result;
    updateFilteredOffers();
  });

  function updateFilteredOffers() {
    filteredOffers = Array.from(offers)
      .filter(([_, offer]) => filterType === 'All' || offer.offer_type.tag === filterType)
      .map(([id, offer]) => ({ id, ...offer }));
  }
  $: {
    if (Array.from(offers).length > 0) {
      updateFilteredOffers();
    }
  }

  function formatAmount(amount: bigint): string {
    return new Intl.NumberFormat().format(Number(amount));
  }
</script>

<main>
  <h1>Offer List</h1>

  <div class="filter-container">
    <button class:active={filterType === 'All'} on:click={() => (filterType = 'All')}>All</button>
    <button class:active={filterType === 'Buy'} on:click={() => (filterType = 'Buy')}>Buy</button>
    <button class:active={filterType === 'Sell'} on:click={() => (filterType = 'Sell')}>Sell</button
    >
  </div>

  <div class="offers-grid">
    {#each filteredOffers as { id, ...offer } (id)}
      <div class="offer-card">
        <h2>{offer.offer_type.tag} {offer.token}</h2>
        <p>Rate: {offer.rate / 100}%</p>
        <p>Currency: {offer.currency}</p>
        <p>Total Amount: {formatAmount(offer.total_tradeable_amount)} {offer.token}</p>
        <p>Time Limit: {offer.time_limit} minutes</p>
        <p>Accepted Payment Methods: {offer.accepted_payment_methods.join(', ')}</p>
        <details>
          <summary>Terms</summary>
          <p>{offer.terms}</p>
        </details>
        <PlaceOrder offer_id={id} offer_type={offer.offer_type.tag} />
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .filter-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .filter-container button {
    background-color: #f0f0f0;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .filter-container button.active {
    background-color: #007bff;
    color: white;
  }

  .offers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .offer-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.3s;
  }

  .offer-card:hover {
    transform: translateY(-5px);
  }

  h2 {
    margin-top: 0;
    color: #333;
  }

  p {
    margin: 0.5rem 0;
  }

  details {
    margin-top: 1rem;
  }

  summary {
    cursor: pointer;
    color: #007bff;
  }
</style>
