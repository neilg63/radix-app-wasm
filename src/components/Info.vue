<template>
<section class="overlay info-overlay" @click="toggleInfo" :class="extraClasses">
    <div class="content" v-html="content"></div>
</section>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { radixInfoItems, placeValueNotes } from '@/settings/info';
import { matchRadixAltLabel } from '@/settings/options';

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
      const label = matchRadixAltLabel(this.base);
      const extra = this.base === 10 ? "" : placeValueNotes(this.base, label);
      return item instanceof Object? item.content + extra : "";
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

