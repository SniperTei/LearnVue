<template>
    <div class="layout">
        <header>
            <!-- Your header content goes here -->
        </header>

        <main>
            <!-- Your main content goes here -->
            This is home page
            <RouterView></RouterView>
        </main>

        <footer>
            <!-- Your footer content goes here -->
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Layout',
    // Your component's logic goes here
}
</script>

<style scoped>
.layout {
    /* Your layout styles go here */
}
</style>