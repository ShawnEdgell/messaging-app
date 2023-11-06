<!-- src/routes/signup/+page.svelte -->
<script>
    import { signUp } from '$lib/auth';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { auth } from '$lib/auth';
  
    let email = '';
    let password = '';
    let errorMessage = '';
  
    onMount(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // If the user is already signed in, redirect to chat
          goto('/chat');
        }
      });
    });
  
    async function handleSignUp() {
      try {
        await signUp(email, password);
        goto('/chat');
      } catch (error) {
        errorMessage = error.message;
      }
    }
</script>

<form on:submit|preventDefault={handleSignUp}>
  <h2>Sign Up</h2>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  <div>
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} required>
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} required>
  </div>
  <button type="submit">Sign Up</button>
</form>

<style>
  .error {
    color: red;
  }
</style>
