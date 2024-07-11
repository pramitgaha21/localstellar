<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import './../global.css';
</script>

<main>
  <Navbar />
  <Modal />
  <slot />
</main>
