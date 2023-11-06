<!-- src/routes/+page.svelte -->
<script>
  import { goto } from '$app/navigation';
</script>

<main>
  <h1>Welcome to the Chat App</h1>
  <p>Connect with people around the world.</p>
  <button on:click={() => goto('/signup')}>Sign Up</button>
  <button on:click={() => goto('/signin')}>Sign In</button>
</main>

<style>
  /* Your CSS here */
</style>
