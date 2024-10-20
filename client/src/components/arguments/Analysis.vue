<template>
  <div class="d-flex flex-column px-3 py-3 rounded-4 shadow-sm" style="font-family: Inter,serif">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2">
        <img :src="chatgptAvatar" alt="ChatGPT" class="rounded-circle"
             style="width: 48px; height: 48px; border: 3px solid #007769">
        <h5 class="argument-owner-username fw-bold mb-0">ChatGPT</h5>
        <div class="d-flex flex-row column gap-1 px-2 rounded text-black fw-bold align-items-center"
             :style="{ fontSize: '14px', maxWidth: 'fit-content', backgroundColor: winner.backgroundColor }">
          <p class="m-0" style="color: white">{{ winner.text }}</p>
          <i class="bi bi-trophy-fill" style="font-size: 12px; color: white" />
        </div>
      </div>
    </div>
    <p class="argument-content-text p-2">{{ content }}</p>
  </div>
</template>

<script>
import chatgptAvatar from '@/assets/avatars/chatgpt-avatar.webp'

export default {
  name: 'ChatGPTAnalysis',
  props: {
    debate: {
      type: Object,
      required: true
    },
    chatgptAvatar: {
      type: String,
      default: 'https://cdn.chatgpt.com/branding/chatgpt-avatar.png'
    }
  },
  setup(props) {
    return {
      winner: {
        text: props.debate.winnerByAI === 'with' ? 'With' : 'Against',
        backgroundColor: 'goldenrod'
      },
      content: props.debate.analysis,
      chatgptAvatar: chatgptAvatar
    };
  }
}
</script>

<style scoped>
.argument-content-text {
  font-size: 17px;
}
</style>
