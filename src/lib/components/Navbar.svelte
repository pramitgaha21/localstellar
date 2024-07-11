<script lang="ts">
  import pkg from '@stellar/freighter-api';
  const { isConnected, setAllowed, getPublicKey, signTransaction } = pkg;
  import { profile, walletAddress } from './../stores/profile.store';
  import { modalMessage } from './../stores/modal.store';
  import { genClient } from '$lib';
  import { goto } from '$app/navigation';

  let isMenuOpen = false;
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  $: walletStatus = 'Connect';

  // when the function is called, it will try to make the login call to the contract
  const connectFreighter = async () => {
    if ((await isConnected()) == false) {
      console.log("user doesn't have freigher");
      modalMessage.set({
        show: true,
        title: 'Freigher Not found',
        type: 'error',
        message: "Freighter Wallet isn't Installed",
      });
      return;
    }

    const isAllowed = await setAllowed();

    if (isAllowed == false) {
      console.log('failed');
      modalMessage.set({
        show: true,
        title: '',
        type: 'error',
        message: '',
      });
      return;
    }
    const publicKey = await getPublicKey();
    walletAddress.set(publicKey);
    walletStatus = 'Connected';

    const backend = genClient(publicKey);

    const tx = await backend.login({ addr: publicKey });

    tx.signAndSend({
      signTransaction,
    })
      .then((result) => {
        if (result.result.isOk()) {
          console.log(result.result.unwrap());
          profile.set(result.result.unwrap());
        }
        goto('/profile');
        return;
      })
      .catch((err) => {
        console.error(err);
        goto('/profile');
      });
  };
</script>

<nav class="sticky">
  <div class="navbar">
    <div class="left-section">
      <h1 class="title">LocalStellar</h1>
      <ul class="nav-links" class:active={isMenuOpen}>
        <li><a href="/">Home</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/offers">Offers</a></li>
      </ul>
    </div>
    <div class="right-section">
      <button class="login-button" on:click={connectFreighter}>{walletStatus}</button>
      <button class="menu-button" on:click={toggleMenu}>☰</button>
    </div>
  </div>
</nav>

<style>
  .sticky {
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f8f9fa;
  }
  .left-section {
    display: flex;
    align-items: center;
  }
  .title {
    font-size: 1.5rem;
    margin: 0;
    margin-right: 2rem;
  }
  .nav-links {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .nav-links li {
    margin-right: 1rem;
  }
  .nav-links a {
    text-decoration: none;
    color: #333;
  }
  .right-section {
    display: flex;
    align-items: center;
  }
  .login-button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  .menu-button {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .navbar {
      flex-wrap: wrap;
    }
    .left-section {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
    }
    .title {
      margin-bottom: 1rem;
    }
    .nav-links {
      display: none;
      width: 100%;
    }
    .nav-links.active {
      display: flex;
      flex-direction: column;
    }
    .nav-links li {
      margin: 0.5rem 0;
    }
    .right-section {
      width: 100%;
      justify-content: flex-end;
    }
    .login-button {
      display: none;
    }
    .menu-button {
      display: block;
    }
  }
</style>
