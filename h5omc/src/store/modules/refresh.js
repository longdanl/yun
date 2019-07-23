import { refresh } from '../../api/refresh'
import { getToken, setToken, removeToken } from '../../utils/auth'
import router, { resetRouter } from '../../router'
import qs from 'qs'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
};

const actions = {
    //刷新token
    refresh({ commit }, refresh_token) {
        removeToken();
        commit('SET_TOKEN', '');
        setToken("");
        return new Promise((resolve, reject) => {
            refresh(qs.stringify({grant_type:'refresh_token', refresh_token:refresh_token})).then(response => {
                let { access_token,refresh_token} = response;
                commit('SET_TOKEN', access_token);
                setToken(access_token);
                resolve();
                //localStorage.removeItem('refresh_token');
                //localStorage.setItem('refresh_token',JSON.stringify(refresh_token))
            }).catch(error => {
                reject(error)
            })
        })
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
