<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="relative overflow-x-clip">
    <LandingBackground />
    <LandingHeader />

    <main class="relative z-10 w-full pt-[72px]">
      <LandingHeroSection />
      <LandingMarqueeSection />
      <LandingServicesSection />
      <LandingWhySection />
      <LandingPackagesSection />
      <LandingProjectsSection />
      <LandingTestimonialsSection />
      <LandingFaqSection />
      <LandingContactSection />
    </main>

    <LandingFooter />
  </div>
</template>
