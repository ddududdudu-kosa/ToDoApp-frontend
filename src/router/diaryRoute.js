// src/router/diaryRoute.js
import DiaryRegisterCompo from '@/components/diary/DiaryRegisterCompo.vue';
import DiaryDetailCompo from '@/components/diary/DiaryDetailCompo.vue';
import DiaryListCompo from '@/components/diary/DiaryListCompo.vue';

export default [
    {
        path: 'diary/register',
        name: 'RegisterDiary',
        component: DiaryRegisterCompo,
    },
    {
        path: 'list',
        name: 'DiaryList',
        component: DiaryListCompo,
    },
    {
        path: ':id',
        name: 'DiaryDetail',
        component: DiaryDetailCompo,
        props: true, // props를 통해 데이터 전달
    },
];
