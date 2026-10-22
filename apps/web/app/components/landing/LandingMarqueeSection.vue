<script setup lang="ts">
const techStack = [
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#5FA04E' },
  { name: 'Go (Golang)', color: '#00ADD8' },
  { name: 'React / Next.js', color: '#61DAFB' },
  { name: 'Vue / Nuxt', color: '#42B883' },
  { name: 'Python', color: '#3776AB' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Kubernetes', color: '#326CE5' },
  { name: 'AWS Cloud', color: '#FF9900' },
  { name: 'Redis', color: '#DC382D' },
  { name: 'GraphQL', color: '#E10098' },
]
</script>

<template>
  <section
    class="w-full border-y border-stroke/60 bg-surface-container-lowest/70 backdrop-blur-md py-6 overflow-hidden"
    aria-label="Tecnologias e infraestrutura"
  >
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12 flex flex-col items-center gap-4">
      <span
        class="font-eyebrow text-eyebrow text-text-muted uppercase tracking-[0.14em] text-center"
      >
        // TECNOLOGIAS &amp; INFRAESTRUTURA DE ALTA PERFORMANCE
      </span>
      <div class="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
        <span
          v-for="tech in techStack"
          :key="tech.name"
          class="px-3.5 py-1.5 rounded-lg bg-surface border border-stroke text-text-strong font-code text-[13px] hover:border-brand-cyan/50 hover:text-brand-cyan transition-colors flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: tech.color }" />
          {{ tech.name }}
        </span>
      </div>
    </div>
  </section>
</template>
