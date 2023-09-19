import { createStore } from 'vuex';
export default createStore({
  state: {
    appId: 0,
    appCode: '', // 应用编码
    userInfo: {
      id: undefined,
      name: undefined,
      account: undefined,
      dept: null,
      tenant: {
        code: undefined,
        name: undefined
      },
      admin: {
        superAdmin: undefined,
        appAdmin: undefined,
        appList: null
      }
    }
  },
  mutations: {
    setAppId(state, data: number) {
      state.appId = data;
    },
    setAppCode(state, data: string) {
      state.appCode = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    }
  }
});
