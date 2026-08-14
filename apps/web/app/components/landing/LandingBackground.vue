<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute inset-0 grid-overlay opacity-[0.07]" aria-hidden="true" />
    <div class="absolute inset-0 bg-mesh opacity-85" />
    <div class="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-violet/25 blur-3xl animate-drift" />
    <div class="absolute right-[-9rem] top-80 h-96 w-96 rounded-full bg-brand-cyan/20 blur-3xl animate-drift delay-240" />
    <div class="absolute left-[-9rem] top-[28rem] h-80 w-80 rounded-full bg-brand-blue/20 blur-3xl animate-drift delay-120" />
  </div>
</template>
