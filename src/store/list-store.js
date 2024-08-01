const store = {
    namespaced: true,
    state() {
        return {
            userIds: [],
        };
    },
    mutations: {
        // state의 등록된 변수들의 상태를 관리
        // 함수로 접근 side-effect
        // increment: function (state) {
        //     ++state.countx;
        // },
        setUserIds(state, ids) {
            state.userIds = ids;
        },
    },
    actions: {
        // mutations에서 만든 state를 변경하는 함수들의 조합
        // 비동기 작업 가능
        // incrementA(context) {
        //     context.commit('increment'); // mutations 속성명 사용
        // },
        updateUserIds({ commit }, ids) {
            commit('setUserIds', ids);
        },
    },
    getters: {
        // 안쓸때도 많음
        // getCountx(state) {
        //     return state.countx;
        // },
        userIds: (state) => state.userIds,
    },
};
export default store;
