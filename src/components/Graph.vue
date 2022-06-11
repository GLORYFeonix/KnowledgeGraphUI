<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { NButton, NInput, NIcon, NUpload, NModal } from 'naive-ui'
import { SearchRound as Search } from '@vicons/material'

let showAdd = ref(false)
let showDelete = ref(false)
let showUpdate = ref(false)
let showSpin = ref(false)
let source = ref("")
let kind = ref("")
let target = ref("")
let sentence = ref("")
let node: Node[] = reactive([])
let data: Relationship[] = reactive([])

type Node = {
    name: string
}
type Relationship = {
    source: string,
    kind: string,
    target: string
}
var nodes: Node[] = []
var relationships: Relationship[] = []

onMounted(() =>
{
    var _source = source.value
    var _target = target.value
    node.length = 0
    data.length = 0
    axios.get(`https://localhost:7183/Knowledge/SearchAllNode`).then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            node.push({ name: res.data[i].name })
        } axios.get(`https://localhost:7183/Knowledge/SearchRelationship?source=${_source}&target=${_target}`).then(function (res)
        {
            for (let i = 0; i < res.data.length; i++) {
                data.push({ source: res.data[i].source, kind: res.data[i].kind, target: res.data[i].target })
            }
            ShowGraph()
        })
    })
})

const AddData = () =>
{
    var _source = source.value
    var _kind = kind.value
    var _target = target.value
    var _sentence = sentence.value

    if (_kind != "") {
        axios.post(`https://localhost:7183/Knowledge/AddRelation?SourceNodeName=${_source}&Type=${_kind}&TargetNodeName=${_target}`)
    }
    else if (_source != "") {
        axios.post(`https://localhost:7183/Knowledge/AddNode?name=${_source}`)
    }
    if (_sentence != "") {
        showSpin.value = true
        axios.post(`https://localhost:7183/Knowledge/SingleSentence?Sentence=${_sentence}`).then(function ()
        {
            showSpin.value = false
        })
    }
    RefreshData()
    ShowGraph()
}
const DeleteData = () =>
{
    var _source = source.value
    var _target = target.value
    axios.delete(`https://localhost:7183/Knowledge/Delete?SourceNodeName=${_source}&TargetNodeName=${_target}`)
    RefreshData()
    ShowGraph()
}
const UpdateData = () =>
{
    var _source = source.value
    var _kind = kind.value
    var _target = target.value
    axios.put(`https://localhost:7183/Knowledge/Update?SourceNodeName=${_source}&Type=${_kind}&TargetNodeName=${_target}`)
    RefreshData()
    ShowGraph()
}
const SearchData = () =>
{
    var _source = source.value
    var _target = target.value
    node.length = 0
    data.length = 0
    axios.get(`https://localhost:7183/Knowledge/SearchAllNode`).then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            node.push({ name: res.data[i].name })
        } axios.get(`https://localhost:7183/Knowledge/SearchRelationship?source=${_source}&target=${_target}`).then(function (res)
        {
            for (let i = 0; i < res.data.length; i++) {
                data.push({ source: res.data[i].source, kind: res.data[i].kind, target: res.data[i].target })
            }
            ShowGraph()
        })
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

const ShowGraph = () =>
{
    type EChartsOption = echarts.EChartsOption;

    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;

    interface RawNode
    {
        name: string;
    }

    interface RawEdge
    {
        source: string;
        target: string;
    }

    interface RawRelationship
    {
        source: string;
        kind: string;
        target: string;
    }

    myChart.showLoading();

    nodes.length = 0
    for (let i = 0; i < node.length; i++) {
        nodes.push(node[i])
    }
    relationships.length = 0
    for (let i = 0; i < data.length; i++) {
        relationships.push(data[i])
    }

    myChart.setOption(
        (option = {
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    zoom: 5,
                    layout: 'force',
                    force: { layoutAnimation: true },
                    roam: true,
                    draggable: true,
                    symbolSize: 20,
                    lineStyle: {
                        width: 5,
                        curveness: 0
                    },
                    label: {
                        show: true,
                        position: "inside"
                    },
                    edgeLabel: {
                        show: true,
                        position: "middle"
                    },
                    labelLayout: {
                        hideOverlap: true,
                    },
                    emphasis: {
                        scale: true,
                        focus: 'adjacency',
                        label: {
                            show: true
                        },
                        edgeLabel: {
                            show: true
                        }
                    },
                    data: nodes.map(function (node: RawNode)
                    {
                        return {
                            name: node.name
                        };
                    }),
                    edges: relationships.map(function (relationship: RawRelationship)
                    {
                        return {
                            source: relationship.source,
                            target: relationship.target
                        };
                    })
                }
            ]
        }),
        true
    );
    option && myChart.setOption(option);

    myChart.hideLoading();
}
</script>

<template>
    <div class="graph-header">
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

    <n-modal v-model:show="showAdd" preset="dialog" title="添加新数据" :showIcon=true positive-text="确定！" negative-text="再想想"
        @positive-click="AddData">
        <n-input type="text" placeholder="请输入源头" v-model:value="source" />
        <n-input type="text" placeholder="请输入种类" show-password-on="mousedown" v-model:value="kind" />
        <n-input type="text" placeholder="请输入目标" v-model:value="target" />
        <n-input type="text" placeholder="或者给我一句话" v-model:value="sentence" />
    </n-modal>
    <n-modal v-model:show="showDelete" preset="dialog" title="真的要删除吗？" :showIcon=true positive-text="确定！"
        negative-text="再想想" @positive-click="DeleteData">
    </n-modal>
    <n-modal v-model:show="showUpdate" preset="dialog" title="请谨慎修改" :showIcon=true positive-text="确定！"
        negative-text="再想想" @positive-click="UpdateData">
        <n-input type="text" placeholder="请输入源头" :disabled=true v-model:value="source" />
        <n-input type="text" placeholder="请输入种类" show-password-on="mousedown" v-model:value="kind" />
        <n-input type="text" placeholder="请输入目标" :disabled=true v-model:value="target" />
    </n-modal>

    <div id="main"></div>
</template>

<style>
.graph-header {
    display: flex;
    height: 54px;
    width: 100%;
    justify-content: space-between;
}

.graph-header .left {
    width: 40%;
    display: flex;
}

.graph-header .left .n-input {
    width: 45%;
    margin: 10px;
}

.graph-header .right {
    display: flex;
}

.graph-header .right .n-button {
    margin: 10px;
}

#main {
    height: 100%;
    width: 100%;
}
</style>