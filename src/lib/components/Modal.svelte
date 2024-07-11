<script>
  import { modalMessage } from './../stores/modal.store';
  const close = () => {
    modalMessage.set({
      show: false,
      type: '',
      title: '',
      message: '',
    });
  };
</script>

{#if $modalMessage.show}
  <div class="modal-backdrop" on:click={close}>
    <div class="modal" on:click|stopPropagation>
      <h2 class={$modalMessage.type}>{$modalMessage.title}</h2>
      <p>{$modalMessage.message}</p>
      <button on:click={close}>Close</button>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .modal {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  h2 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 24px;
    font-weight: 600;
  }

  p {
    margin-bottom: 20px;
    line-height: 1.5;
    color: #333;
  }

  .success {
    color: #2ecc71;
  }

  .error {
    color: #e74c3c;
  }

  .info {
    color: #3498db;
  }

  button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #2980b9;
  }

  @media (max-width: 480px) {
    .modal {
      padding: 20px;
    }

    h2 {
      font-size: 20px;
    }

    p {
      font-size: 14px;
    }

    button {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
</style>

