<script setup lang="ts">
import { storeToRefs } from 'pinia'

const notify = useNotifyStore()
const { toasts } = storeToRefs(notify)
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        class="pointer-events-none fixed inset-x-4 bottom-6 z-[100] flex flex-col items-stretch gap-3 sm:inset-x-auto sm:right-6 sm:top-24 sm:bottom-auto sm:w-[min(100%,22rem)]"
        aria-relevant="additions removals"
      >
        <TransitionGroup name="notify-stack">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            class="pointer-events-auto w-full"
          >
            <NotifyPopup
              :variant="toast.variant"
              :title="toast.title"
              :message="toast.message"
              @dismiss="notify.dismiss(toast.id)"
            />
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.notify-stack-enter-active,
.notify-stack-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.notify-stack-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.notify-stack-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.notify-stack-move {
  transition: transform 0.24s ease;
}
</style>
