<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="relative overflow-x-clip pb-16">
    <LandingBackground />
    <LandingHeader />

    <main>
      <LandingHeroSection />
      <LandingServicesSection />
      <LandingWhySection />
      <LandingTestimonialsSection />
      <LandingFaqSection />
      <LandingContactSection />
    </main>

    <LandingFooter />
  </div>
</template>
