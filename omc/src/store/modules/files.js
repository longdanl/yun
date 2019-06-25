import { downloadFiles } from '../../api/crbt'
import qs from "qs"
const state = {
   crbtfile:''
};

const mutations = {
    SET_CRBTFILE: (state, crbtfile) => {
        state.crbtfile = crbtfile
    },
    SET_FILE:(state,filename) =>{
        state.filename = filename
    }
};
const actions = {
    //下载文件
    downloadFiles({ commit }, filename) {
        let haha = sessionStorage.getItem("user")
        console.log(haha.access_token)
        return new Promise((resolve, reject) => {
            downloadFiles(filename,qs.stringify({access_token:access_token})).then(res => {
                commit('SET_CRBTFILE',res);
                commit('SET_FILE',filename);
                resolve();
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
