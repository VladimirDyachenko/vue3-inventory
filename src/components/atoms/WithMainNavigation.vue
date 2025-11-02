<script setup lang="ts">
import { LayoutGrid, ArrowRightLeft } from 'lucide-vue-next'
</script>

<template>
  <header>
    <nav class="border-b border-border bg-card/50 backdrop-blur-sm mb-6">
      <div class="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-2 sm:flex-row 2xl:px-0">
        <RouterLink
          to="/"
          class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          activeClass="bg-primary text-primary-foreground font-semibold"
        >
          <LayoutGrid class="w-4 h-4" />
          Инвентарь
        </RouterLink>
        <RouterLink
          to="/split-view"
          class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          activeClass="bg-primary text-primary-foreground font-semibold"
        >
          <ArrowRightLeft class="w-4 h-4" />
          Обмен
        </RouterLink>
      </div>
    </nav>
  </header>

  <main>
    <slot></slot>
  </main>
</template>
