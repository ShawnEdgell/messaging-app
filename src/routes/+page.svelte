<script>
  import { db } from '../firebase.js';
  import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
  import { onMount } from 'svelte';

  let name = '';
  let message = '';
  let messages = [];

  const messagesCollectionRef = collection(db, 'messages');

  async function sendMessage() {
    if (name.trim() && message.trim()) {
      await addDoc(messagesCollectionRef, {
        name: name.trim(),
        message: message.trim(),
        timestamp: new Date()
      });
      message = ''; // Clear the message input after sending
    }
  }

  function formatDate(timestamp) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  function isNewDay(previous, current) {
    const prevDate = previous && new Date(previous.timestamp.seconds * 1000);
    const currDate = new Date(current.timestamp.seconds * 1000);
    return !previous || prevDate.toDateString() !== currDate.toDateString();
  }

  // Scroll to bottom function
  function scrollToBottom(node) {
    // This will be called when the element is added to the DOM and after each update.
    node.scrollTop = node.scrollHeight;
  }

  onMount(() => {
    const q = query(messagesCollectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).reverse(); // Reverse the messages to display newest last
    });

    return unsubscribe;
  });
</script>

<main>
  <section class="messages" use:scrollToBottom>
    {#each messages as message, i (message.id)}
      {#if isNewDay(messages[i - 1], message)}
        <div class="date-marker">
          {formatDate(message.timestamp)}
        </div>
      {/if}
      <div class="message-container">
        <p><strong>{message.name}</strong>: {message.message}</p>
        <div class="timestamp">
        <small>
          {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </small>
      </div>
      </div>
    {/each}
  </section>

  <div class="input-form">
    <input type="text" placeholder="Name" bind:value={name} />
    <input type="text" placeholder="Message" bind:value={message} />
    <button on:click={sendMessage}>Send</button>
  </div>
</main>

<style>
  /* Reset and base styles from the provided stylesheet */
  :global(html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video) {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }

  :global(html) {
    display: flex;
    justify-content: center;
  }

  :global(body) {
    line-height: 1;
    background-color: #eaeaea;
    font-family: 'Courier New', Courier, monospace;
    color: #333;
    padding: 2rem;
    width: 100vw;
    max-width: 50rem;
  }

  .messages {
    max-height: calc(95vh - 200px); /* Adjust 200px based on the total height of other elements */
    overflow-y: auto; /* Enables vertical scrolling */
  }

  .message-container {
    margin-bottom: 1.5rem;
    position: relative;
    padding: 0.5rem;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
  }

  .message-container + .message-container::before {
    content: '';
    position: absolute;
    top: -1rem;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #333;
    opacity: 0.25;
  }

  .date-marker {
    padding: 0.5rem;
    text-align: center;
    color: #555;
  }

  .input-form {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    gap: 1rem;
  }

  input[type="text"] {
    padding: 0.5rem;
    border: 2px solid #333;
    border-radius: 8px;
    background-color: transparent;
  }

  button {
    background-color: #f2f2f2;
    border: 3px solid #333;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 8px;
  }

  button:hover {
    background-color: #ddd;
  }

  .timestamp {
    min-width: 90px;
    text-align: right;
  }

  @media (max-width: 768px) {
    :global(body) {
      padding: 1rem;
    }

    input[type="text"] {
      padding: 0.5rem;
    }
  }
</style>
