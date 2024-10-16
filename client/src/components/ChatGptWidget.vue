<template>
    <div class="chat-gpt-widget">
      <h3>ChatGPT Assistant</h3>
      <div class="chat-history" ref="chatHistoryRef">
        <div v-for="(message, index) in chatHistory" :key="index" :class="message.type">
          {{ message.text }}
        </div>
      </div>
      <div class="chat-input">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Type your message...">
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onUpdated } from 'vue';
  import { Api } from '@/api/v1/Api.js';
  
  export default {
    name: 'ChatGptWidget',
    setup() {
      const userInput = ref('');
      const chatHistory = ref([]);
      const chatHistoryRef = ref(null);
  
      const sendMessage = async () => {
        if (userInput.value.trim() === '') return;
  
        // Add user message to chat history
        chatHistory.value.push({ type: 'user', text: userInput.value });
  
        try {
          const response = await Api.post('/v1/chatgpt/generate', { prompt: userInput.value });
          // Add ChatGPT response to chat history
          chatHistory.value.push({ type: 'assistant', text: response.data.response });
        } catch (error) {
          console.error('Error sending message to ChatGPT:', error);
          chatHistory.value.push({ type: 'error', text: 'Error: Unable to get response from ChatGPT.' });
        }
  
        // Clear user input
        userInput.value = '';
      };
  
      onUpdated(() => {
        // Scroll to the bottom of the chat history
        if (chatHistoryRef.value) {
          chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
        }
      });
  
      return {
        userInput,
        chatHistory,
        chatHistoryRef,
        sendMessage,
      };
    },
  };
  </script>
  
  <style scoped>
  .chat-gpt-widget {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .chat-history {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
  }
  
  .chat-input {
    display: flex;
    padding: 10px;
  }
  
  input {
    flex-grow: 1;
    margin-right: 10px;
    padding: 5px;
  }
  
  button {
    padding: 5px 10px;
  }
  
  .user {
    text-align: right;
    margin-bottom: 5px;
  }
  
  .assistant {
    text-align: left;
    margin-bottom: 5px;
  }
  
  .error {
    color: red;
    text-align: center;
    margin-bottom: 5px;
  }
  </style>