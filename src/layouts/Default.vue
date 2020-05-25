<template>
  <div class="container mx-auto px-4">
    <slot />
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>
