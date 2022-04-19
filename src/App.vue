<script setup lang="ts">
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
</script>

<template>
    <n-config-provider abstract :theme="darkTheme">
        <n-dialog-provider>
            <n-message-provider>
                <router-view></router-view>
            </n-message-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>

<style>
* {
    margin: 0px;
    padding: 0px;
}

html,
body,
#app {
    height: 100%;
}
</style>
