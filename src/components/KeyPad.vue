<template>
<section class="keypad" @click="toggleInfo" :class="extraClasses">
    <div class="inner">
      <div v-if="hasUpperKeys" class="key-set upper-keys">
        <Button v-for="upKey in upperNumKeys" :key="upKey.key" @click="keyPress(upKey)" class="p-button-info number-unit" :class="numClass(upKey)" v-tooltip.bottom="upKey.value">{{upKey.name}}</Button>
      </div>
      <div class="key-set core-keys">
        <Button v-for="unitKey in numKeys" :key="unitKey.key" @click="keyPress(unitKey)" class="p-button-info number-unit" :class="numClass(unitKey)">{{unitKey.name}}</Button>
        <Button key="dotKey.key" @click="keyPress(dotKey)" class="p-button-info decimal-dot">{{dotKey.name}}</Button>
        <Button v-if="showEqualsInNums" key="eqKey.key" @click="keyPress(eqKey)" class="p-button-success equals">{{eqKey.name}}</Button>
      </div>
      <div class="key-set core-operators">
        <Button v-for="opKey in opKeys" :key="opKey.key" @click="keyPress(opKey)" class="p-button-warning operator">{{opKey.name}}</Button>
        <Button v-if="showEqualsInOperator" key="eqKey.key" @click="keyPress(eqKey)" class="p-button-success equals">{{eqKey.name}}</Button>
      </div>
    </div>
    <div class="key-set brackets">
      <Button v-for="pKey in parenKeys" :key="pKey.key" @click="keyPress(pKey)" class="p-button-warning operator">{{pKey.name}}</Button>
    </div>
</section>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { buildUnitSet, buildUpperUnitSet, smartConvertNotation } from '@/services/funcs';
import { groupKeys, operators } from '@/settings/options';

interface UnitKey {
  key: string;
  value: string;
  name: string;
}

export default defineComponent({
  name: 'KeyPad',
  props: {
    base: {
      type: Number,
      default: 10
    },
  },
  emits: ['key-press'],
  computed: {
    numKeys(): UnitKey[]  {
      return buildUnitSet(this.base).reverse().map(value => {
        const key = ['unit-key', value].join('-');
        return { 
          key,
          value,
          name: smartConvertNotation(value, this.base)
        }
      });
    },
    upperNumKeys(): UnitKey[]  {
      return buildUpperUnitSet(this.base).reverse().map((value, index) => {
        const key = ['unit-key', value].join('-');
        const numVal = index * 10;
        return { 
          key,
          value: numVal.toString(),
          name: value
        }
      });
    },
    hasUpperKeys() {
      return this.upperNumKeys.length > 0;
    },
    opKeys(): UnitKey[]  {
      return operators.map(op => {
        
        const key = ['op-key', op.key].join('-');
        return { 
          key,
          value: op.key,
          name: op.symbol
        }
      });
    },
    dotKey() {
      return {
        key: 'key-decimal-dot',
        value: 'dot',
        name: '·',
      }
    },
    eqKey() {
      return {
        key: 'key-eq',
        value: 'equals',
        name: '=',
      }
    },
    parenKeys() {
      return groupKeys.map(gk => {
        return {
          key: ['key', gk.key].join('-'),
          value: gk.key,
          name: gk.symbol
        }
      });
    },
    showEqualsInNums() {
      switch (this.base) {
        case 7:
        case 8:
        case 10:
        case 12:
        case 14:
        case 16:
        case 20:
        case 30:
        case 36:
        case 60:
          return true;
        default:
          return false;
      }
    },
    showEqualsInOperator() {
      switch (this.base) {
        case 2:
        case 5:
        case 6:
          return true;
        default:
          return false;
      }
    },
    extraClasses(): string[] {
      const cls = [['radix', this.base].join('-')];
      let size = 'medium';
      let cols = 3;
      const opOr = this.base < 7 ? 'horizontal' : 'vertical';
      switch (this.base) {
        case 2:
        case 5:
          size = 'large';
          break;
        case 6:
        case 7:
        case 8:
          cols = 4;
          size = 'm-large';
          break;
        case 10:
          cols = 3;
          size = 'medium';
          break;
        case 12:
          cols = 4;
          size = 'medium';
          break;
        case 14:
        case 16:
          cols = 4;
          size = 'm-small';
          break;
        case 20:
          cols = 5;
          size = 'm-small';
          break;
        case 30:
          cols = 5;
          size = 'small';
          break;
        case 36:
          cols = 6;
          size = 'small';
          break;
      }
      cls.push(size);
      cls.push(['op', opOr].join('-'));
      cls.push(['cols', cols].join('-'));
      return cls;
    }
  },
  methods: {
    keyPress(key: UnitKey) {
      this.$emit('key-press', key.value);
    },
    numClass(unit: UnitKey) {
      return ['number', unit.name].join('-');
    }
  }
});
</script>

