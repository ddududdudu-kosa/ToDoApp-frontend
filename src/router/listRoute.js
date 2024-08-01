import ListCompo from '@/views/list/ListCompo';
import UserStoryCompo from '@/views/list/UserStoryCompo.vue';
import MyAllStoryCompo from '@/views/list/MyAllStoryCompo.vue';
export default [
    { path: '/list', component: ListCompo },
    {
        path: '/stories/user/:userId',
        name: 'UserStoryCompo',
        component: UserStoryCompo,
        props: (route) => ({
            user: {
                id: route.params.userId,
                name: route.query.name,
                imgUrl: route.query.imgUrl,
            },
        }),
    },
    {
        path: '/stories/my',
        name: 'MyAllStory',
        component: MyAllStoryCompo,
    },
];
