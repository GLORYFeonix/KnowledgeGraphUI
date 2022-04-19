//TODO menu与tab的选中项的显示联动
<script setup lang="ts">
import { h, ref, computed, Component } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { darkTheme, NConfigProvider, NIcon, NMenu, NBreadcrumb, NBreadcrumbItem, NTabs, NTab, NNumberAnimation } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

import
{
    UserCog as UserIcon
} from '@vicons/fa'
import
{
    AccountTreeFilled as DataIcon
} from '@vicons/material'

function renderIcon(icon: Component)
{
    return () => h(NIcon, null, { default: () => h(icon) })
}

const route = useRoute()
const router = useRouter()
const isAdmin = ref(route.params.isAdmin != "true")
const valueRef = ref("")
const panelsRef = ref(["数据管理"])
const closableRef = computed(() =>
{
    return panelsRef.value.length > 1
})

const menuOptions: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        // name: 'users'
                    }
                },
                { default: () => '用户管理' }
            ),
        key: '用户管理',
        icon: renderIcon(UserIcon),
        disabled: isAdmin.value
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        // name: 'graph'
                    }
                },
                { default: () => '数据管理' }
            ),
        key: '数据管理',
        icon: renderIcon(DataIcon)
    }
]

const menuClick = (key: string) =>
{
    for (let i = 0; i < panelsRef.value.length; i++) {
        if (key == panelsRef.value[i]) {
            handleUpdateValue(key)
            return
        }
    }
    panelsRef.value.push(key)
    handleUpdateValue(key)
}

const handleClose = (name: string) =>
{
    const { value: panels } = panelsRef
    const nameIndex = panels.findIndex((panelName) => panelName === name)
    if (!~nameIndex) return
    panels.splice(nameIndex, 1)
    if (name === valueRef.value) {
        valueRef.value = panels[Math.min(nameIndex, panels.length - 1)]
    }
}

const handleUpdateValue = (value: string) =>
{
    if (value == "数据管理") {
        router.replace({
            name: "graph"
        })
    }
    else {
        router.replace({
            name: "users"
        })
    }
}
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <div class="sider">
            <div class="logo">
                <img src="../assets/KnowledgeGraph.png" alt="图标" />
                <span>Knowledge Graph</span>
            </div>
            <n-menu :options="menuOptions" :on-update:value="menuClick" />
        </div>
        <div class="content">
            <div class="header">
                <div class="line1">
                    <!-- <n-breadcrumb>
                        <n-breadcrumb-item href="#">
                            <n-icon>
                                <UserIcon />
                            </n-icon> 用户管理
                        </n-breadcrumb-item>
                        <n-breadcrumb-item href="#">
                            <n-icon>
                                <DataIcon />
                            </n-icon> 数据管理
                        </n-breadcrumb-item>
                    </n-breadcrumb> -->

                    <div class="userinfo">
                        <span>欢迎您，</span>
                        <span>{{ route.params.name }}</span>
                    </div>
                </div>
                <div class="line2">
                    <n-tabs type="card" :closable="closableRef" :animated=true @close="handleClose"
                        @update:value="handleUpdateValue">
                        <n-tab v-for="panel in panelsRef" :name="panel">
                            {{ panel }}
                        </n-tab>
                    </n-tabs>
                    <!-- <div class="number">
                        <span>您已经处理了</span>
                        <n-number-animation ref="numberAnimationInstRef" :from="0" :to="67373" />
                        <span>行数据。</span>
                        <span>愿每一份努力都不被辜负。</span>
                    </div> -->
                </div>
            </div>
            <div class="body">
                <router-view />
                <!-- <Graph /> -->
            </div>
            <!-- <div class="footer">Footer</div> -->
        </div>
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
    background-color: #101014;
}

.n-config-provider {
    height: 100%;
    display: flex;
    flex-direction: row;
}

.sider {
    width: 200px;
    background-color: #18181c;
}

.sider .logo {
    height: 60px;
    width: 200px;
    display: flex;
    align-items: center;
}

.sider .logo img {
    display: inline-block;
    height: 50px;
}

.sider .logo span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bolder;
    color: #1890ff;
}

.sider .n-menu {
    width: 200px;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.header {
    height: 100px;
    /* display: flex;
    flex-direction: column; */
    background-color: #18181c;
}

.header .line1 {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    height: 50px;
    width: 100%;
    color: #fff;
}

.header .line1 .n-breadcrumb {
    margin-top: 20px;
    padding-left: 20px;
}

.header .line1 .userinfo {
    display: flex;
    height: 50px;
    /* width: 100px; */
    margin-right: 10px;
}

.header .line1 .userinfo span {
    display: inline-block;
    line-height: 50px;
    font-size: 18px;
    font-weight: 400;
}

.header .line2 {
    display: flex;
    height: 50px;
    width: 100%;
}

.header .line2 .n-tabs .n-tab-pane {
    padding-top: 0px;
}

.body {
    flex: 1;
    margin: 15px;
    /* border: 1px solid #000; */
    border-radius: 10px;
    background-color: #18181c;
}

.footer {
    height: 20px;
    background-color: #18181c;
}
</style>