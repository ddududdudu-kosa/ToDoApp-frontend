import MypageCompo from '@/views/mypage/MypageCompo';
import MyRecordCompo from '@/views/mypage/MyRecordCompo';
import RankCompo from '@/views/mypage/RankCompo';
import RatingCompo from '@/views/mypage/RatingCompo';

// 작성자 : 이종섭(leejongseop)

export default [
    {
        name: 'MypageCompo',
        path: '/mypage',
        component: MypageCompo,
        children: [
            {
                name: 'MyRecordCompo',
                path: '/mypage/record',
                component: MyRecordCompo,
            },
            {
                name: 'RankCompo',
                path: '/mypage/rank',
                component: RankCompo,
            },
            {
                name: 'RatingCompo',
                path: '/mypage/rating',
                component: RatingCompo,
            },
        ],
    },
];
