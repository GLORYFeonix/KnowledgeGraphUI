import { defineStore } from "pinia";
import { Names } from "./store-name";

export const Test = defineStore(Names.TEST, {
    state: () =>
    {
        return {
            current: 1,
            name: "gzy"
        }
    },

    getters: {

    },

    actions: {

    }
})