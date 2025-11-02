<script setup lang="ts">
import { cn } from '@/utils'
import type { ClassValue } from 'clsx'
import { useAttrs } from 'vue'
const props = defineProps<{ class?: ClassValue }>()
const attrs = useAttrs()
</script>

<template>
  <div v-bind="attrs" :class="cn('flex flex-col space-y-1.5 p-6', props.class)">
    <slot></slot>
  </div>
</template>
