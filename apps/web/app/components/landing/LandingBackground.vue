<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 grid-overlay" />
    <div
      class="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-violet/20 blur-[120px] animate-drift"
    />
    <div
      class="absolute -right-10 top-16 h-80 w-80 rounded-full bg-brand-cyan/15 blur-[120px] animate-drift delay-240"
    />
    <div class="noise-overlay absolute inset-0" />
  </div>
</template>
