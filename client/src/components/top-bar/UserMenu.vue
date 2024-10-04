<template>
  <div class="user-menu">
    <img :src="user.avatar || avatar" alt="User Avatar" class="avatar" />
    <h3>{{ user.name }}</h3>
  </div>
</template>

<script>
import avatar from './../../../assets/avatars/avatar.png';

export default {
  name: 'UserMenu',
  props: {
    user: {
      type: Object,
      default: () => ({
        name: '',
        email: '',
        avatar: '',
      }),
    },
  },
  data() {
    return {
      avatar,
    };
  },
  methods: {
    updateUser(user) {
      this.avatar = avatar;
    }
  }
}
</script>

<style scoped>
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
</style>
