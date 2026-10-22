<script setup lang="ts">
withDefaults(
  defineProps<{
    heightClass?: string
  }>(),
  {
    heightClass: 'h-8',
  }
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 520 130"
    :class="[heightClass, 'w-auto max-w-full select-none']"
    fill="none"
    aria-label="CAG Tech"
    role="img"
  >
    <defs>
      <!-- Brand Gradient: Violet -> Indigo -> Cyan -->
      <linearGradient id="cag-logo-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C464FF" />
        <stop offset="50%" stop-color="#3F6EFF" />
        <stop offset="100%" stop-color="#1DB6FD" />
      </linearGradient>

      <!-- Subtle glow filter -->
      <filter id="cag-logo-subtle-glow" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Group: Isótipo Hexagonal Tecnológico -->
    <g transform="translate(20, 20)">
      <!-- Hexágono base com preenchimento dark e contorno gradiente -->
      <path
        d="M45 4 L78 23 L78 67 L45 86 L12 67 L12 23 Z"
        stroke="url(#cag-logo-brand-grad)"
        stroke-width="3.5"
        stroke-linejoin="round"
        fill="#0B1020"
        fill-opacity="0.85"
      />

      <!-- Stylized 'C' bracket on left -->
      <path
        d="M52 21 L31 33 L31 57 L52 69"
        stroke="url(#cag-logo-brand-grad)"
        stroke-width="4.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Central tech node diamond -->
      <polygon points="45,39 53,45 45,51 37,45" fill="url(#cag-logo-brand-grad)" />

      <!-- Code slash / bridge beam -->
      <path
        d="M39 59 L55 31"
        stroke="#1DB6FD"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.95"
      />

      <!-- Engineering pulse dot com glow -->
      <circle cx="65" cy="45" r="3.5" fill="#1DB6FD" filter="url(#cag-logo-subtle-glow)" />
      <circle cx="65" cy="45" r="1.5" fill="#FFFFFF" />
    </g>

    <!-- Group: Wordmark Typography -->
    <text
      x="132"
      y="73"
      font-family="'Space Grotesk', sans-serif"
      font-size="46"
      font-weight="700"
      letter-spacing="-0.03em"
      fill="#F4F7FF"
    >
      CAG
    </text>

    <text
      x="244"
      y="73"
      font-family="'Space Grotesk', sans-serif"
      font-size="46"
      font-weight="700"
      letter-spacing="-0.03em"
      fill="url(#cag-logo-brand-grad)"
    >
      TECH
    </text>

    <!-- Subtitle: Software Engineering com status dot -->
    <g transform="translate(134, 98)">
      <circle cx="3" cy="-4" r="2.5" fill="#2BD99F" />
      <text
        x="14"
        y="0"
        font-family="'JetBrains Mono', monospace"
        font-size="11.5"
        font-weight="500"
        letter-spacing="0.14em"
        fill="#8A9BBD"
      >
        SOFTWARE ENGINEERING
      </text>
    </g>
  </svg>
</template>
