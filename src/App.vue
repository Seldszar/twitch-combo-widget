<template>
  <div 
    id="app" 
    :style="{ alignItems }">
    <Counter 
      v-if="bestCombo && bestCombo.amount >= $settings.threshold" 
      v-bind="bestCombo" 
      :key="bestCombo.id" />
  </div>
</template>

<script>
import emojiRegex from "emoji-regex";
import { find, head, keys, orderBy, reject, some } from "lodash";
import { Client } from "twitch-js";
import Counter from "./components/Counter.vue";

export default {
  components: {
    Counter,
  },
  data() {
    return {
      combos: [],
    };
  },
  computed: {
    bestCombo() {
      return head(orderBy(this.combos, "amount", "desc"));
    },
    alignItems() {
      switch (this.$settings.alignment) {
        case "left":
          return "flex-start";

        case "right":
          return "flex-end";

        default:
          return "center";
      }
    },
  },
  async created() {
    const bttvEmotes = await this.fetchBttvEmotes();
    const ffzEmotes = await this.fetchFfzEmotes();
    let id = 0;

    const client = new Client({
      channels: [`#${this.$settings.channel}`],
      connection: {
        reconnect: true,
      },
    });

    client.on("chat", (channel, context, message) => {
      if (this.$settings.excludedUsers.includes(context.username)) {
        return;
      }

      const messageEmotes = this.getMessageEmotes(bttvEmotes, ffzEmotes, context, message);

      for (const combo of this.combos) {
        if (some(messageEmotes, combo.emote)) {
          combo.amount += 1;
        } else {
          combo.destroyed = true;
          this.combos = reject(this.combos, combo);
        }
      }

      for (const emote of messageEmotes) {
        const combo = find(this.combos, { emote });

        if (!combo) {
          id = (id + 1) % Number.MAX_SAFE_INTEGER;
          this.combos.push({ id, emote, amount: 1 });
        }
      }
    });

    client.connect();
  },
  methods: {
    async fetchBttvEmotes() {
      let emotes = [];

      await fetch(`https://api.betterttv.net/2/emotes`).then(async res => {
        emotes = emotes.concat((await res.json()).emotes);
      });

      await fetch(`https://api.betterttv.net/2/channels/${this.$settings.channel}`).then(
        async res => {
          emotes = emotes.concat((await res.json()).emotes);
        },
      );

      return emotes;
    },
    async fetchFfzEmotes() {
      let emotes = [];

      await fetch(`https://api.frankerfacez.com/v1/set/global`)
        .then(res => res.json())
        .then(data => {
          for (const set of Object.values(data.sets)) {
            emotes = emotes.concat(set.emoticons);
          }
        });

      await fetch(`https://api.frankerfacez.com/v1/room/${this.$settings.channel}`)
        .then(res => res.json())
        .then(data => {
          for (const set of Object.values(data.sets)) {
            emotes = emotes.concat(set.emoticons);
          }
        });

      return emotes;
    },
    getMessageEmotes(bttvEmotes, ffzEmotes, context, message) {
      const emotes = [];
      const regex = emojiRegex();
      let match;

      for (const value of keys(context.emotes)) {
        emotes.push({ type: "twitch", value });
      }

      for (const emote of bttvEmotes) {
        if (message.includes(emote.code)) {
          emotes.push({ type: "betterttv", value: emote.id });
        }
      }

      for (const emote of ffzEmotes) {
        if (message.includes(emote.name)) {
          emotes.push({ type: "frankerfacez", value: emote.id });
        }
      }

      while ((match = regex.exec(message))) {
        emotes.push({ type: "emoji", value: match[0] });
      }

      return emotes;
    },
  },
};
</script>

<style lang="scss">
@import "settings";
@import "foundation";

@include foundation-global-styles;
@include foundation-typography;

#app {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: rem-calc(50);
  position: relative;
}
</style>
