import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from '../components/Login.vue'
import System from '../components/System.vue'
import Users from '../components/Users.vue'
import Graph from '../components/Graph.vue'

// const routes: Array<RouteRecordRaw> = [
//     {
//         path: "/",
//         name: "footer",
//         component: () => import("../components/footer.vue"),
//         children: [
//             {
//                 path: "",
//                 name: "login",
//                 component: () => import("../components/login.vue")
//             },
//             {
//                 path: "regist",
//                 name: "regist",
//                 component: () => import("../components/regist.vue")
//             }
//         ]
//     }
// ]

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "login",
            component: Login
        },
        {
            path: "/system/:name",
            name: "system",
            component: System,
            children: [
                {
                    path: "/users/:name",
                    name: "users",
                    component: Users
                },
                {
                    path: "/graph/:name",
                    name: "graph",
                    component: Graph
                }
            ]
        }
    ]
})

export default router