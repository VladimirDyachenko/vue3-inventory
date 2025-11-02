<script setup lang="ts">
import { cn } from '@/utils'
import type { ClassValue } from 'clsx'
import { useAttrs } from 'vue'
const props = defineProps<{ class?: ClassValue }>()
const attrs = useAttrs()
</script>

<template>
  <h3 v-bind="attrs" :class="cn('text-2xl font-semibold leading-none tracking-tight', props.class)">
    <slot></slot>
  </h3>
</template>
