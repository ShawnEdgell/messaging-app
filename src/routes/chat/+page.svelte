<script>
    import { onMount } from 'svelte';
    import { auth } from '$lib/auth';
    import { subscribeToMessages } from '$lib/firestore';
    import { goto } from '$app/navigation';
  
    let messages = [];
    let newMessage = '';
  
    onMount(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          subscribeToMessages((newMessages) => {
            messages = newMessages;
          });
        } else {
          goto('/signin');
        }
      });
    });
  
    async function sendMessage() {
      if (newMessage.trim() === '') return;
      const authorName = auth.currentUser.displayName || "Anonymous";
      await addMessage(newMessage, authorName);
      newMessage = ''; // The input will be cleared after sending
      // Messages will automatically update via the subscription
    }
  </script>
  
  <main>
    <h1>Chat Room</h1>
    <div id="messages">
      {#each messages as message}
        <p>{message.authorName}: {message.content}</p>
      {/each}
    </div>
    <form on:submit|preventDefault={sendMessage}>
      <input bind:value={newMessage} placeholder="Type a message" />
      <button type="submit">Send</button>
    </form>
  </main>
  