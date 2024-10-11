<template>
  <div class="d-flex column-gap-3 user-menu d-flex align-items-center">
    <h3 class="fs-6" style="font-weight: bold">@{{ user.username }}</h3>
    <img :src="user.profilePicture || avatar" alt="User Avatar" class="avatar"/>
  </div>
</template>

<script>
import avatar from './../../../assets/avatars/avatar.png'; // Default avatar path

export default {
  name: 'UserMenu',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      avatar,
    };
  },
};
</script>

<style scoped>

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
