<template>
  <div class="Emote">
    <template v-if="type === 'emoji'">
      {{ value }}
    </template>
    <template v-else>
      <img :src="url">
    </template>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    url() {
      switch (this.type) {
        case "twitch":
          return `https://static-cdn.jtvnw.net/emoticons/v1/${this.value}/1.0`;

        case "betterttv":
          return `https://cdn.betterttv.net/emote/${this.value}/1x`;

        case "frankerfacez":
          return `https://cdn.frankerfacez.com/emoticon/${this.value}/1`;
      }
    },
  },
};
</script>

<style lang="scss">
@import "settings";
@import "foundation";

.Emote {
  align-items: center;
  display: flex;
  font-size: rem-calc(48);
  height: rem-calc(56);
  justify-content: center;
  line-height: 1;
  text-shadow: none;
  width: rem-calc(56);

  img {
    display: block;
    height: 100%;
    object-fit: contain;
    width: 100%;
  }
}
</style>
