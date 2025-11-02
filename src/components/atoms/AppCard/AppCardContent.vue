<script setup lang="ts">
import { cn } from '@/utils'
import type { ClassValue } from 'clsx'
import { useAttrs } from 'vue'
const props = defineProps<{ class?: ClassValue }>()
const attrs = useAttrs()
</script>

<template>
  <div v-bind="attrs" :class="cn('p-6 pt-0', props.class)">
    <slot></slot>
  </div>
</template>
