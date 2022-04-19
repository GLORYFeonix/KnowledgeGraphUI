<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as echarts from 'echarts';
import axios from 'axios';

type User = {
    name: string
}
type Relationship = {
    source: string,
    target: string
}
var nodes: User[] = []
var edges: Relationship[] = []

onMounted(() =>
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

    myChart.showLoading();
    axios.get("https://localhost:7183/Knowledge/SearchAllUser").then(function (res)
    {
        for (let i = 0; i < res.data.length; i++) {
            nodes.push(res.data[i])
        }

        axios.get("https://localhost:7183/Knowledge/SearchAllRelationship").then(function (res)
        {
            for (let i = 0; i < res.data.length; i++) {
                edges.push(res.data[i])
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
                                // show: true,
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
                            edges: edges.map(function (edge: RawEdge)
                            {
                                return {
                                    source: edge.source,
                                    target: edge.target
                                };
                            })
                        }
                    ]
                }),
                true
            );
            option && myChart.setOption(option);
        })
    })
    myChart.hideLoading();
})
</script>

<template>
    <div id="main"></div>
</template>

<style>
#main {
    height: 100%;
    width: 100%;
}
</style>