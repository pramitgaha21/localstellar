<script lang="ts">
  import pkg from '@stellar/freighter-api';
  const { signTransaction } = pkg;
  import { genClient } from '$lib';
  import { modalMessage } from '$lib/stores/modal.store';
  import { walletAddress } from '$lib/stores/profile.store';

  export let disputeId: bigint;

  let approval: boolean = true;

  const decisionOnClaimApproval = async () => {
    if ($walletAddress == null) {
      modalMessage.set({
        show: true,
        title: 'Wallet not Connected',
        message: 'Please connect your wallet',
        type: 'error',
      });
      return;
    }

    const backend = genClient($walletAddress);
    const tx = await backend.decision_on_claim({
      addr: $walletAddress,
      dispute_id: disputeId,
      approval,
    });
    tx.signAndSend({
      signTransaction,
    })
      .then((result) => {
        if (result.result.isOk()) {
          modalMessage.set({
            show: true,
            title: 'Successfully Decision Provided',
            message: 'Successfully Decision Provided',
            type: 'success',
          });
          return;
        } else {
          modalMessage.set({
            show: true,
            title: 'Failed to provide Decision',
            message: result.result.unwrapErr().message,
            type: 'error',
          });
          return;
        }
      })
      .catch((err) => {
        modalMessage.set({
          show: true,
          title: 'Failed to provide Decision',
          message: err,
          type: 'error',
        });
      });
  };
</script>

<div class="buttons">
  <button
    on:click={() => {
      approval = true;
      decisionOnClaimApproval();
    }}>Approve</button
  >
  <button
    on:click={() => {
      approval = false;
      decisionOnClaimApproval();
    }}>Disapprove</button
  >
</div>
