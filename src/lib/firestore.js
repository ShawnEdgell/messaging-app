import { db } from './firebase'; // This is correct
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth } from './firebase'; // This should be from './firebase', not './auth'

// Function to add a message
export async function addMessage(content, authorName) {
  if (!auth.currentUser) {
    throw new Error('You must be logged in to post a message.');
  }

  const messageData = {
    content,
    authorId: auth.currentUser.uid,
    authorName: authorName,
    timestamp: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'messages'), messageData);
    return docRef;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Function to subscribe to messages
export function subscribeToMessages(callback) {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });

  return unsubscribe; // Returns the unsubscribe function to stop listening when needed
}
