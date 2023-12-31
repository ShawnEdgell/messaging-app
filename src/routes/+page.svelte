<script>
  import { db } from '../firebase.js';
  import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
  import { onMount, tick } from 'svelte';

  let name = '';
  let message = '';
  let messages = [];
  let messagesEnd; // This will be the element we want to scroll into view

  const messagesCollectionRef = collection(db, 'messages');

  async function sendMessage() {
    if (name.trim() && message.trim()) {
      await addDoc(messagesCollectionRef, {
        name: name.trim(),
        message: message.trim(),
        timestamp: new Date()
      });
      message = ''; // Clear the message input after sending
      await tick(); // Wait for the DOM to update
      scrollToBottom(); // Then scroll to the bottom
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
  function scrollToBottom() {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  onMount(() => {
    const q = query(messagesCollectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).reverse(); // Reverse the messages to display newest last
      tick().then(scrollToBottom); // Ensure scrolling happens after the DOM updates
    });

    return unsubscribe;
  });
</script>

<main>
  <section class="messages">
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
    <span bind:this={messagesEnd}></span>
  </section>

  <div class="input-form">
    <input type="text" placeholder="Name" bind:value={name} />
    <input type="text" placeholder="Message" bind:value={message} />
    <button on:click={sendMessage}>Send Message</button>
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
    background-color: #eceff2;
    font-family: 'Courier New', Courier, monospace;
    color: #333;
    padding: 2rem;
    width: 100vw;
    max-width: 50rem;
  }

  .messages {
    max-height: calc(90vh - 200px); /* Adjust 200px based on the total height of other elements */
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
    gap: 0.5rem;
    align-items: center;
  }

  input[type="text"] {
    padding: 0.5rem;
    border: 2px solid #333;
    border-radius: 5px;
    background-color: white;
    width: 96%;
  }

  button {
    color: white;
    background-color: #16161a;
    border: 3px solid #16161a;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 5px;
  }

  button:hover {
    background-color: #333;
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
