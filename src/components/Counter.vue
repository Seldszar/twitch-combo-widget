<template>
  <transition
    :css="false"
    appear
    v-on="{ afterEnter, beforeEnter, beforeLeave, enter, leave }">
    <div
      :class="{ 'Counter--rainbow': amount >= 10 }"
      :style="{ 'transform-origin': $settings.alignment, '--rainbow-duration': `${0.1 + (Math.max(0, 25 - amount) * 0.1)}s` }"
      class="Counter">
      <div class="Counter__inner">
        COMBO <Emote
          v-bind="emote"
          class="Counter__emote" /> x{{ amount }}
      </div>
    </div>
  </transition>
</template>

<script>
import { TimelineLite, TweenLite } from "gsap";
import Emote from "./Emote.vue";

export default {
  components: {
    Emote,
  },
  props: {
    emote: {
      type: Object,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    destroyed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scale() {
      return 1 + Math.min(1, (this.amount - 1) * (1 / (25 - 1)));
    },
  },
  watch: {
    amount() {
      this.$nextTick(() => {
        if (this.ready && !this.destroyed) {
          TweenLite.fromTo(
            this.$el,
            0.3,
            { color: "red", scale: this.scale * 1.1, rotationZ: Math.random() >= 0.5 ? 10 : -10 },
            { color: "white", scale: this.scale, rotationZ: 0 },
          );
        }
      });
    },
  },
  methods: {
    beforeEnter(el) {
      TweenLite.set(el, { height: "auto", opacity: 0 });
    },
    enter(el, done) {
      const tl = (this.enterTimeline = new TimelineLite({ onComplete: done }));

      this.$nextTick(() => {
        tl.set(el, { scale: this.scale * 1.5 });
        tl.from(el, 0.6, { height: 0 });
        tl.to(el, 0.3, { scale: this.scale, opacity: 1 });
      });
    },
    afterEnter() {
      this.ready = true;
    },
    beforeLeave(el) {
      this.ready = false;

      if (this.enterTimeline) {
        this.enterTimeline.kill({ opacity: true, scale: true }, el);
      }
    },
    leave(el, done) {
      const tl = new TimelineLite({ onComplete: done });
      const delay = Math.min(20, 1 + this.amount / 2);

      this.$nextTick(() => {
        tl.set(el, { zIndex: 0 });
        tl.to(el, 0.3, { opacity: 1, scale: 1 });
        tl.to(el, 0.3, { opacity: 0.5, delay: 1 });
        tl.to(el, 0.6, { opacity: 0, delay });
        tl.to(el, 0.6, { height: 0 });
      });
    },
  },
};
</script>

<style lang="scss">
@import "settings";
@import "foundation";

@keyframes rainbow {
  0% {
    color: orange;
  }
  20% {
    color: red;
  }
  40% {
    color: yellow;
  }
  60% {
    color: green;
  }
  80% {
    color: blue;
  }
  100% {
    color: orange;
  }
}

.Counter {
  z-index: 10;

  &__inner {
    align-items: center;
    display: flex;
    font-size: rem-calc(38);
    line-height: 1;
    margin: rem-calc(4 0);
    text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }

  &__emote {
    margin: rem-calc(0 4);
  }

  &--rainbow {
    .Counter {
      &__inner {
        animation: var(--rainbow-duration) infinite rainbow;
      }
    }
  }
}
</style>
