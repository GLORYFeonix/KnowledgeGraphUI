<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { NButton, useMessage, NDataTable, DataTableColumns, NModal, NInput, NIcon, NUpload } from 'naive-ui'
import { SearchRound as Search } from '@vicons/material'

let showAdd = ref(false)
let showDelete = ref(false)
let showUpdate = ref(false)
let source = ref("")
let kind = ref("")
let target = ref("")
type Relationship = {
    source: string
    kind: string
    target: string
}
let data: Relationship[] = reactive([])

const createColumns = ({ Modify }: { Modify: (row: Relationship) => void }, { Delete }: { Delete: (row: Relationship) => void }): DataTableColumns<Relationship> => (
    [
        {
            title: 'Source',
            key: 'source',
            align: 'center'
        },
        {
            title: 'Kind',
            key: 'kind'
        },
        {
            title: 'Target',
            key: 'target'
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
    Modify(row: Relationship)
    {
        source.value = row.source
        kind.value = row.kind
        target.value = row.target
        showUpdate.value = true
    }
}, {
    Delete(row: Relationship)
    {
        source.value = row.source
        showDelete.value = true
    }
})

onMounted(() =>
{
    axios.get("https://localhost:7183/Knowledge/SearchAllRelationship").then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            data.push({ source: res.data[i].source, kind: res.data[i].kind, target: res.data[i].target })
        }
    })
})

const AddData = () =>
{
    var _source = source.value
    var _kind = kind.value
    var _target = target.value
    // axios.post(`https://localhost:7183/Users/CreateUser?userName=${_userName}&password=${_password}&name=${_name}`)
    RefreshData()
}
const DeleteData = () =>
{
    // var _userName = userName.value
    // axios.delete(`https://localhost:7183/Users/DeleteUserByUserName?userName=${_userName}`)
    RefreshData()
}
const UpdateData = () =>
{
    // var _userName = userName.value
    // var _password = password.value
    // var _name = name.value
    // axios.put(`https://localhost:7183/Users/UpdataUserByUserName?userName=${_userName}&password=${_password}&name=${_name}`)
    RefreshData()
}
const SearchData = () =>
{
    var _source = source.value
    var _target = target.value
    data.length = 0
    axios.get(`https://localhost:7183/Knowledge/SearchRelationship?source=${_source}&target=${_target}`).then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            data.push({ source: res.data[i].source, kind: res.data[i].kind, target: res.data[i].target })
        }
    })
}
const RefreshData = () =>
{
    data.length = 0
    axios.get("https://localhost:7183/Knowledge/SearchAllRelationship").then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            data.push({ source: res.data[i].source, kind: res.data[i].kind, target: res.data[i].target })
        }
    })
}
</script>

<template>
    <div class="datas-header">
        <div class="left">
            <n-input clearable placeholder="源头" v-model:value="source" />
            <n-input clearable placeholder="目标" v-model:value="target" />
            <n-button text style="font-size: 24px" @click="SearchData">
                <n-icon>
                    <Search />
                </n-icon>
            </n-button>
        </div>
        <div class="right">
            <n-upload action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f" accept=".txt">
                <n-button type="info" ghost>导入文件</n-button>
            </n-upload>
            <n-button type="info" ghost @click="showAdd = true">新增</n-button>
        </div>
    </div>
    <n-data-table :columns="columns" :data="data" :pagination=false :striped="false" />
    <n-modal v-model:show="showAdd" preset="dialog" title="添加新数据" :showIcon=true positive-text="确定！" negative-text="再想想"
        @positive-click="AddData">
        <n-input type="text" placeholder="请输入源头" v-model:value="source" />
        <n-input type="password" placeholder="请输入种类" show-password-on="mousedown" v-model:value="kind" />
        <n-input type="text" placeholder="请输入目标" v-model:value="target" />
    </n-modal>
    <n-modal v-model:show="showDelete" preset="dialog" title="真的要删除吗？" :showIcon=true positive-text="确定！"
        negative-text="再想想" @positive-click="DeleteData">
    </n-modal>
    <n-modal v-model:show="showUpdate" preset="dialog" title="请谨慎修改" :showIcon=true positive-text="确定！"
        negative-text="再想想" @positive-click="UpdateData">
        <n-input type="text" placeholder="请输入源头" :disabled=true v-model:value="source" />
        <n-input type="password" placeholder="请输入种类" show-password-on="mousedown" v-model:value="kind" />
        <n-input type="text" placeholder="请输入目标" v-model:value="target" />
    </n-modal>
</template>

<style scoped>
.datas-header {
    display: flex;
    height: 54px;
    width: 100%;
    justify-content: space-between;
}

.datas-header .left {
    width: 40%;
    display: flex;
}

.datas-header .left .n-input {
    width: 45%;
    margin: 10px;
}

.datas-header .right {
    display: flex;
}

.datas-header .right .n-button {
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