<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { particles } from '../config/particles-config'
import { NInput, NSwitch, NTooltip, NButton, NModal, useMessage } from 'naive-ui'

let userName = ref()
let password = ref()
let name = ref()
let remMe = ref(false)
let showModal = ref(false)
const router = useRouter()
const message = useMessage()

onMounted(() =>
{
    var userInfo = JSON.parse(localStorage["UserInfo"])
    userName.value = userInfo.userName
    password.value = userInfo.password
    remMe.value = localStorage["remMe"] == "true" ? true : false
})

const signin = () =>
{
    var userInfo = {
        userName: "",
        password: ""
    };
    var _userName = userName.value
    var _password = password.value
    var _remMe = remMe.value;

    axios.get(`https://localhost:7183/Sign/${_userName}/${_password}`).then(function (res)
    {
        localStorage["remMe"] = _remMe
        if (_remMe) {
            userInfo.userName = _userName;
            userInfo.password = res.data.password;
            localStorage["UserInfo"] = JSON.stringify(userInfo);
        }
        else {
            localStorage.removeItem("UserInfo");
        }
        if (res.data != "") {
            router.push({
                name: "system",
                params: {
                    name: res.data.name,
                    isAdmin: res.data.isAdmin
                }
            })
        }
        else {
            message.error("用户名或密码错误！");
        }
    })
}

const signup = () =>
{
    var _userName = userName.value
    var _password = password.value

    if (!_userName || !_password) {
        message.error("用户名或密码不能为空！")
    }
    else {
        showModal.value = true
    }
}

const register = () =>
{
    var userInfo = {
        userName: "",
        password: ""
    };
    var _userName = userName.value
    var _password = password.value
    var _name = name.value
    var _remMe = remMe.value;

    axios.post(`https://localhost:7183/Sign/${_userName}/${_password}/${_name}`).then(function (res)
    {
        localStorage["remMe"] = _remMe
        if (_remMe) {
            userInfo.userName = _userName;
            userInfo.password = _password;
            localStorage["UserInfo"] = JSON.stringify(userInfo);
        }
        else {
            localStorage.removeItem("UserInfo");
        }
        if (res.data == "name") {
            message.error("姓名重复")
        }
        else if (res.data == "username") {
            message.error("用户名重复")
        }
        else if (res.data == "success") {
            router.push({
                name: "system",
                params: {
                    name: name.value
                }
            })
        }
    })
}
</script>

<template>
    <div class="background">
        <Particles id="tsparticles" class="particles" :options="particles" />
        <div class="login">
            <div class="header">
                <img src="../assets/KnowledgeGraph.png" alt="图标" />
                <span>Ti Knowledge Graph</span>
            </div>
            <div class="content">
                <h3>账号密码登录</h3>
                <n-input type="text" placeholder="请输入账号" v-model:value="userName" />
                <n-input type="password" show-password-on="mousedown" placeholder="请输入密码" v-model:value="password" />
                <div class="rof">
                    <n-switch v-model:value="remMe">
                        <template #checked>好的！</template>
                        <template #unchecked>记住我</template>
                    </n-switch>
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <n-button :bordered="false">忘记密码？</n-button>
                        </template>
                        请联系管理员解决
                    </n-tooltip>
                </div>
                <div class="uoi">
                    <n-button type="info" @click="signin">登录</n-button>
                    <n-button type="primary" @click="signup">注册</n-button>
                </div>
            </div>
        </div>
        <n-modal v-model:show="showModal" preset="dialog" title="起一个响亮的名字" :showIcon=false positive-text="就是这个！"
            negative-text="算了。。。" @positive-click="register">
            <n-input type="text" placeholder="请输入名字" v-model:value="name" />
        </n-modal>
    </div>
</template>

<style scoped>
.background {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(125deg, #55efc4, #81ecec, #74b9ff, #a29bfe, #fd79a8);
    background-size: 400%;
    animation: bganimation 10s infinite;
}

@keyframes bganimation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

particles {
    z-index: 2;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
}

.login {
    z-index: 1;
    height: 380px;
    width: 360px;
    border-radius: 25px;
    padding: 24px 32px;
    background-color: #18181c;
    color: #fff;
}

.login .header {
    display: flex;
    justify-content: space-between;
    height: 70px;
}

.login .header img {
    width: 70px;
    height: 70px;
}

.login .header span {
    display: inline-block;
    margin: auto 0;
    height: 28px;
    line-height: 28px;
    font-size: 28px;
    color: #1890ff;
}

.login .content {
    padding-top: 24px;
}

.login .content h3 {
    font-size: 18px;
    font-weight: 500;
    color: #1890ff;
}

.login .content .n-input {
    display: inline-flex;
    flex: 1;
    margin-top: 24px;
    height: 40px;
    line-height: 40px;
}

.login .content .rof {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
}

.login .content .rof .n-button {
    height: 18px;
    padding: 0px;
}

.login .content .uoi {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
}

.login .content .uoi .n-button {
    width: 45%;
}
</style>