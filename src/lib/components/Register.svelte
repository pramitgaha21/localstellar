<script lang="ts">
  import { goto } from '$app/navigation';
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { profile, walletAddress } from '$lib/stores/profile.store';
  import pkg from '@stellar/freighter-api';

  const { signTransaction } = pkg;

  let username: string;

  const register = async () => {
    if ($walletAddress == null) {
      modalMessage.set({
        show: true,
        title: 'Wallet not Connected',
        message: 'Please Connect your wallet',
        type: 'info',
      });
      return;
    }
    if (username.length == 0) {
      modalMessage.set({
        show: true,
        title: 'Username too Short',
        message: 'Username is too short, Use a longer username',
        type: 'info',
      });
      return;
    }

    const backend = genClient($walletAddress);

    const tx = await backend.register({ addr: $walletAddress, username });
    tx.signAndSend({
      signTransaction,
    })
      .then((result) => {
        if (result.result.isOk()) {
          profile.set(result.result.unwrap());
          goto('profile');
          return;
        } else {
          modalMessage.set({
            show: true,
            title: 'User Already Registed',
            message: 'User already Registered, Try logging in directly',
            type: 'error',
          });
          return;
        }
      })
      .catch((err) => {
        console.log(err);
        modalMessage.set({
          show: true,
          title: 'User Already Registed',
          message: 'User already Registered, Try logging in directly',
          type: 'error',
        });
        return;
      });
  };
</script>

<div class="register">
  <input type="text" placeholder="Enter an Username" bind:value={username} />
  <button on:click={register}>Register</button>
</div>

<style>
  .register {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .register input[type='text'] {
    padding: 12px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s ease;
    outline: none;
  }

  .register input[type='text']:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  .register button {
    padding: 12px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.1s ease;
  }

  .register button:hover {
    background-color: #2980b9;
  }

  .register button:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    .register {
      max-width: 100%;
    }
  }
</style>
