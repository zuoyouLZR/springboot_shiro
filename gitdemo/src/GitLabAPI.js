// (function () {
//   function install (Vue, options) {
//     // 填入你的GIT地址
//
//     var url = localStorage.getItem("giturl")
//     alert(url)
//     // 填入你的私人TOKEN
//     var token = localStorage.getItem("tokens")
//
//
//     if (typeof options !== 'undefined') {
//
//       if (typeof options.token !== 'undefined') {
//         token = options.token
//       }
//
//
//       if (typeof options.url !== 'undefined') {
//
//         url = options.url.replace(/\/$/, '')
//       }
//     }
//
//
//     var apiUrl = url + '/api/v4'
//
//
//     Vue.prototype.GitLabAPI = {
//
//       setUrl: function (newUrl) {
//
//         if (typeof newUrl === 'undefined') {
//           console.warn('[vue-gitlab-api] This GitLab instance URL may not be correct')
//           url = ''
//         } else {
//           url = newUrl.replace(/\/$/, '')
//         }
//         apiUrl = url + '/api/v4'
//       },
//
//
//       setToken: function (newToken) {
//         if (typeof newToken === 'undefined' || newToken == null || newToken === '') {
//           console.error('[vue-gitlab-api] You MUST provide a non empty Private Token or Personal Access Token')
//           return
//         }
//         token = newToken
//       },
//
//
//
//       get: function (uri, params, fillIn, errorCb) {
//
//         if (this._verifyFillIn(fillIn) !== true) {
//           return
//         }
//
//
//         uri = uri.replace(/^\/?/, '/')
//
//
//         this._updateStore('downloading')
//
//
//         Vue.http.get(
//           apiUrl + uri,
//           {
//             headers: {
//               'PRIVATE-TOKEN': token
//             },
//             params: params
//           }
//         ).then((response) => {
//
//           this._updateStore('downloaded')
//
//           if (typeof fillIn === 'function') {
//
//             fillIn(response)
//           } else {
//
//             Vue.set(fillIn[0], fillIn[1], response.body)
//           }
//         }, (response) => {
//
//           this._updateStore('downloaded')
//
//           if (typeof errorCb === 'function') {
//
//             errorCb(response)
//           } else {
//
//             console.error('[vue-gitlab-api] GET ' + uri + ' failed: "' + response.body.message + '" on ' + apiUrl + ' (using token "' + token + '")')
//           }
//         })
//       },
//
//
//       post: function (uri, params, fillIn, errorCb) {
//         // verifying what user sends to fill in
//         if (this._verifyFillIn(fillIn) !== true) {
//           return
//         }
//
//         // ensure leading slash on uri
//         uri = uri.replace(/^\/?/, '/')
//
//         // downloading starts now
//         this._updateStore('downloading')
//
//         // request it with headers an params
//         Vue.http.post(
//           apiUrl + uri,
//           params,
//           {
//             headers: {
//               'PRIVATE-TOKEN': token
//             }
//           }
//         ).then((response) => {
//
//           this._updateStore('downloaded')
//
//           if (typeof fillIn === 'function') {
//
//             fillIn(response)
//           } else {
//
//             Vue.set(fillIn[0], fillIn[1], response.body)
//           }
//         }, (response) => {
//
//           this._updateStore('downloaded')
//
//           if (typeof errorCb === 'function') {
//
//             errorCb(response)
//           } else {
//
//             console.error('[vue-gitlab-api] POST ' + uri + ' failed: "' + response.body.message + '" on ' + apiUrl + ' (using token "' + token + '")')
//           }
//         })
//       },
//
//
//       registerStore: function (store) {
//         if (typeof store === 'undefined') {
//           console.error('[vue-gitlab-api] This do not appear to be a Vuex store')
//           return
//         }
//
//
//         store.registerModule('GitLabAPI', {
//           state: {
//             downloading: false,
//             running: 0
//           },
//           mutations: {
//             downloading: function (state) {
//
//               state.running++
//               state.downloading = true
//             },
//             downloaded: function (state) {
//
//               state.running--
//               if (state.running === 0) {
//                 state.downloading = false
//               }
//             }
//           }
//         })
//
//
//         this._vuexStore = store
//       },
//
//
//       _vuexStore: null,
//
//
//       _updateStore: function (mutation) {
//         if (this._vuexStore != null) {
//           this._vuexStore.commit(mutation)
//         }
//       },
//
//
//       _verifyFillIn: function (fillIn) {
//
//         if (typeof fillIn !== 'function') {
//
//           if (!(fillIn instanceof Array) || fillIn.length < 2) {
//             console.error('[vue-gitlab-api] You MUST define the Vue data you want to fill as a two values array')
//             return false
//           }
//
//
//           if (Array.isArray(fillIn[0]) || typeof fillIn[0] !== 'object') {
//             console.error('[vue-gitlab-api] Your Vue data to fill MUST be an object (ie `{}`)')
//             return false
//           }
//         }
//
//         return true
//       }
//     }
//   }
//
//   if (typeof exports === 'object') {
//     module.exports = install
//   }
// })()
