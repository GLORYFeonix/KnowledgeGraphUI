<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { NButton, NInput, NIcon, NUpload } from 'naive-ui'
import { SearchRound as Search } from '@vicons/material'

let showAdd = ref(false)
let source = ref("")
let kind = ref("")
let target = ref("")
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
                    symbolSize: 35,
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