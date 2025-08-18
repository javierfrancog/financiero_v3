<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="msg.role">
        <strong>{{ msg.role }}:</strong> {{ msg.content }}
      </div>
    </div>
    <input
      v-model="userInput"
      @keyup.enter="sendMessage"
      placeholder="Escribe tu pregunta.xx.."
    />
    <button @click="sendMessage">Enviar</button>
  </div>
</template>
  
  <script>
import { sendMessageToGPT } from '../services/chatService';

export default {
  name: "ChatGPT",
  data() {
    return {
      userInput: "",
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const userMessage = this.userInput;
      this.messages.push({ role: "user", content: userMessage });
      this.userInput = "";

      try {
        const response = await sendMessageToGPT(userMessage);
        this.messages.push({ role: "assistant", content: response });
      } catch (error) {
        this.messages.push({
          role: "assistant",
          content: "Error al obtener respuesta del asistente.",
        });
      }
    },
  },
};
</script>
  
  <style scoped>
.chat-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
}
.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.user {
  text-align: right;
  background-color: #d0f0ff;
}
.assistant {
  text-align: left;
  background-color: #f0f0f0;
}
</style>
  

