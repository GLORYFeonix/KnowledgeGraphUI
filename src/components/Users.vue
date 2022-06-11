<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { NButton, useMessage, NDataTable, DataTableColumns, NModal, NInput, NIcon } from 'naive-ui'
import { SearchRound as Search } from '@vicons/material'

let showAdd = ref(false)
let showDelete = ref(false)
let showUpdate = ref(false)
let userName = ref()
let password = ref()
let name = ref()
type User = {
    name: string
    userName: string
    password: string
}
let data: User[] = reactive([])

const createColumns = ({ Modify }: { Modify: (row: User) => void }, { Delete }: { Delete: (row: User) => void }): DataTableColumns<User> => (
    [
        {
            title: 'Name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'UserName',
            key: 'userName'
        },
        {
            title: 'Password',
            key: 'password'
        },
        {
            title: 'Action',
            key: 'actions',
            render(row: any)
            {
                return [
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: "warning",
                            ghost: true,
                            onClick: () => Modify(row)
                        },
                        { default: () => "编辑" }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: "error",
                            ghost: true,
                            onClick: () => Delete(row)
                        },
                        { default: () => "删除" }
                    )
                ]
            }
        }
    ]
)

const message = useMessage()
const columns = createColumns({
    Modify(row: User)
    {
        userName.value = row.userName
        password.value = row.password
        name.value = row.name
        showUpdate.value = true
    }
}, {
    Delete(row: User)
    {
        userName.value = row.userName
        showDelete.value = true
    }
})

onMounted(() =>
{
    axios.get("https://localhost:7183/Users/GetAllUsers").then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            data.push({ name: res.data[i].name, userName: res.data[i].userName, password: res.data[i].password })
        }
    })
})

const AddUser = () =>
{
    var _userName = userName.value
    var _password = password.value
    var _name = name.value
    axios.post(`https://localhost:7183/Users/CreateUser?userName=${_userName}&password=${_password}&name=${_name}`)
    RefreshUser()
}
const DeleteUser = () =>
{
    var _userName = userName.value
    axios.delete(`https://localhost:7183/Users/DeleteUserByUserName?userName=${_userName}`)
    RefreshUser()
}
const UpdateUser = () =>
{
    var _userName = userName.value
    var _password = password.value
    var _name = name.value
    axios.put(`https://localhost:7183/Users/UpdataUserByUserName?userName=${_userName}&password=${_password}&name=${_name}`)
    RefreshUser()
}
const SearchUser = () =>
{
    var _userName = userName.value
    var _name = name.value
    data.length = 0
    axios.get(`https://localhost:7183/Users/GetUserByUserNameAndName?userName=${_userName}&name=${_name}`).then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            data.push({ name: res.data[i].name, userName: res.data[i].userName, password: res.data[i].password })
        }
    })
}
const RefreshUser = () =>
{
    data.length = 0
    axios.get("https://localhost:7183/Users/GetAllUsers").then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            data.push({ name: res.data[i].name, userName: res.data[i].userName, password: res.data[i].password })
        }
    })
}
</script>

<template>
    <div class="users-header">
        <div class="left">
            <n-input clearable placeholder="账号" v-model:value="userName" />
            <n-input clearable placeholder="名字" v-model:value="name" />
            <n-button text style="font-size: 24px" @click="SearchUser">
                <n-icon>
                    <Search />
                </n-icon>
            </n-button>
        </div>
        <div class="right">
            <n-button type="info" ghost @click="showAdd = true">新增</n-button>
        </div>
    </div>
    <n-data-table :columns="columns" :data="data" :pagination=false :striped="false" />
    <n-modal v-model:show="showAdd" preset="dialog" title="添加新用户" :showIcon=true positive-text="确定！" negative-text="再想想"
        @positive-click="AddUser">
        <n-input type="text" placeholder="请输入账号" v-model:value="userName" />
        <n-input type="password" placeholder="请输入密码" show-password-on="mousedown" v-model:value="password" />
        <n-input type="text" placeholder="请输入名字" v-model:value="name" />
    </n-modal>
    <n-modal v-model:show="showDelete" preset="dialog" title="真的要删除吗？" :showIcon=true positive-text="确定！"
        negative-text="再想想" @positive-click="DeleteUser">
    </n-modal>
    <n-modal v-model:show="showUpdate" preset="dialog" title="请谨慎修改" :showIcon=true positive-text="确定！"
        negative-text="再想想" @positive-click="UpdateUser">
        <n-input type="text" placeholder="请输入账号" :disabled=true v-model:value="userName" />
        <n-input type="password" placeholder="请输入密码" show-password-on="mousedown" v-model:value="password" />
        <n-input type="text" placeholder="请输入名字" v-model:value="name" />
    </n-modal>
</template>

<style scoped>
.users-header {
    display: flex;
    height: 54px;
    width: 100%;
    justify-content: space-between;
}

.users-header .left {
    width: 40%;
    display: flex;
}

.users-header .left .n-input {
    width: 45%;
    margin: 10px;
}

.users-header .right .n-button {
    margin: 10px;
}

.n-data-table .n-button {
    margin-right: 20px;
}

.n-modal .n-input {
    margin-top: 10px;
}

.n-modal .n-button {
    margin: 0;
}
</style>