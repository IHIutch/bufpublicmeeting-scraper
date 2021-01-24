<template>
  <div class="container mx-auto px-4 flex">
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
