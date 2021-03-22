<template>
<section class="overlay info-overlay" @click="toggleInfo" :class="extraClasses">
    <div class="content" v-html="content"></div>
</section>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { radixInfoItems } from '@/settings/info';

export default defineComponent({
  name: 'Info',
  props: {
    base: {
      type: Number,
      default: 10
    },
    visible: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    content(): string {
      const item = radixInfoItems.find(item => item.radix === this.base);
      return item instanceof Object? item.content : "";
    },
    extraClasses(): string[] {
      const cls = [['radix', this.base].join('-')];
      if (this.visible) {
        cls.push('active');
      } else {
        cls.push('inctive');
      }
      return cls;
    }
  },
});
</script>

