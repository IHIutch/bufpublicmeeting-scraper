<template>
  <div class="flex container mx-auto">
    <div class="w-1/4 px-4">
      <div class="sticky top-0 pt-4">
        <h2 class="font-medium text-2xl mb-2">
          Sorting &amp; Filters
        </h2>
        <div class="border rounded p-2 mb-4">
          <fieldset>
            <legend class="font-medium text-xl">Sort by:</legend>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Name (Asc)</label>
            </div>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Name (Desc)</label>
            </div>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Date (Asc)</label>
            </div>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Date (Desc)</label>
            </div>
          </fieldset>
        </div>
        <div class="border rounded p-2">
          <fieldset>
            <legend class="font-medium text-xl">Filter Meeting Type:</legend>
            <div>
              <input
                type="checkbox"
                name="filtering"
                id="legislation_committee"
              />
              <label for="legislation_committee">Legislation Committee</label>
            </div>
            <div>
              <input type="checkbox" name="filtering" />
              <label>Preservation Board</label>
            </div>
            <div>
              <input type="checkbox" name="filtering" />
              <label>Bicycle and Pedestrian Advisory Board</label>
            </div>
            <div>
              <input type="checkbox" name="filtering" />
              <label>Common Council</label>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <div class="w-3/4 px-4">
      <slot />
    </div>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>
