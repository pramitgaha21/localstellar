<script lang="ts">
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';
  import type { OfferDetail, OfferType } from 'backend';

  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let showForm = false;
  let offer_type: OfferType = { tag: 'Buy', values: undefined };
  let currency: string;
  let token: string;
  let total_amount: number;
  let rate: number;
  let min_limit: number;
  let max_limit: number;
  let time_limit: number;
  let terms: string;

  let newPaymentMethod = '';
  let paymentMethods: Set<string> = new Set();

  function addPaymentMethod() {
    if (newPaymentMethod && !paymentMethods.has(newPaymentMethod)) {
      paymentMethods = new Set(paymentMethods).add(newPaymentMethod);
      newPaymentMethod = '';
    }
  }

  function removePaymentMethod(method: string) {
    paymentMethods = new Set([...paymentMethods].filter((m) => m !== method));
  }

  function toggleForm() {
    showForm = !showForm;
  }

  const createOffer = async () => {
    if ($walletAddress == null) {
      modalMessage.set({
        show: true,
        title: 'Wallet not Connected',
        message: 'Please Connect your wallet and trying registering',
        type: 'info',
      });
      return;
    }

    const offerData = {
      addr: $walletAddress,
      offer_type,
      currency,
      token,
      rate: rate * 100,
      trade_limit: [BigInt(min_limit * 10000000), BigInt(max_limit * 10000000)] as const,
      total_amount: BigInt(total_amount * 10000000),
      time_limit: time_limit,
      payment_methods: Array.from(paymentMethods),
      terms,
    };

    const backend = genClient($walletAddress);
    const tx = await backend.create_offer(offerData);
    tx.signAndSend({
      signTransaction,
    })
      .then((result) => {
        if (result.result.isOk()) {
          modalMessage.set({
            show: true,
            title: 'Offer Successfully Created',
            message: 'Offer Successfully Created',
            type: 'success',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        modalMessage.set({
          show: true,
          title: 'Failed to create Offer',
          message: 'Failed to crate Offer',
          type: 'error',
        });
      });

    dispatch('createOffer', offerData);
    showForm = false;
  };
</script>

<button on:click={toggleForm}>Create Offer</button>

{#if showForm}
  <div class="modal">
    <div class="modal-content">
      <h2>Create Offer</h2>
      <form on:submit|preventDefault={createOffer}>
        <div class="form-grid">
          <label>
            Offer Type:
            <select
              bind:value={offer_type.tag}
              on:change={() => (offer_type = { tag: offer_type.tag, values: undefined })}
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </label>

          <label>
            Currency:
            <input type="text" bind:value={currency} required />
          </label>

          <label>
            Token:
            <select bind:value={token} required>
              <option value="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC">XLM</option>
              <option value="CCGCRYUTDRP52NOPS35FL7XIOZKKGQWSP3IYFE6B66KD4YOGJMWVC5PR">USDC</option>
            </select>
          </label>

          <label>
            Total Amount:
            <input type="number" bind:value={total_amount} required />
          </label>

          <label>
            Rate:
            <input type="number" bind:value={rate} required />
          </label>

          <label>
            Min Limit:
            <input type="number" bind:value={min_limit} required />
          </label>

          <label>
            Max Limit:
            <input type="number" bind:value={max_limit} required />
          </label>

          <label>
            Time Limit (in Minutes):
            <input type="number" bind:value={time_limit} required />
          </label>
        </div>

        <fieldset>
          <legend>Payment Methods:</legend>
          <div class="payment-method-input">
            <input type="text" bind:value={newPaymentMethod} placeholder="Enter payment method" />
            <button type="button" on:click={addPaymentMethod}>Add</button>
          </div>
          {#if paymentMethods.size > 0}
            <ul class="payment-methods-list">
              {#each Array.from(paymentMethods) as method}
                <li>
                  {method}
                  <button class="remove-button" on:click={() => removePaymentMethod(method)}
                    >×</button
                  >
                </li>
              {/each}
            </ul>
          {/if}
        </fieldset>

        <label>
          Terms:
          <textarea bind:value={terms} required></textarea>
        </label>

        <div class="button-group">
          <button type="submit">Create Offer</button>
          <button type="button" on:click={toggleForm}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal {
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
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
  }

  h2 {
    margin-top: 0;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: bold;
  }

  input,
  select,
  textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  textarea {
    height: 100px;
    resize: vertical;
  }

  fieldset {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1rem;
  }

  .payment-method-input {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .payment-methods-list {
    list-style-type: none;
    padding: 0;
  }

  .payment-methods-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: #f0f0f0;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }

  .remove-button {
    background-color: transparent;
    border: none;
    color: #f44336;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 0.5rem;
  }

  .remove-button:hover {
    color: #d32f2f;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #45a049;
  }

  button[type='button'] {
    background-color: #f44336;
  }

  button[type='button']:hover {
    background-color: #da190b;
  }
</style>
