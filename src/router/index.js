import Vue from "vue";
import VueRouter from "vue-router";

import DefaultLayout from "@/components/layout/DefaultLayout";
import LoginLayout from "@/components/layout/LoginLayout";


import PageNotFoundCompo from "@/components/exception/PageNotFoundCompo.vue";
import loginRoute from "./loginRoute";
import feedRoute from "./feedRoute";
import listRoute from "./listRoute";
import mypageRoute from "./mypageRoute";
import signupRoute from "./signupRoute";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: LoginLayout,
        children: [
            ...loginRoute,
            ...signupRoute,
        ]
    },
    {
        path: '/',
        component: DefaultLayout,
        children: [
            ...feedRoute,
            ...listRoute,
            ...mypageRoute,
        ]
    },
    {
        path: '*',
        component: PageNotFoundCompo
    }
];

export default new VueRouter({
    mode: 'history',
    routes
});
