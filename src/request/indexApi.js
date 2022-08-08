import {service} from './api'

export function sendMsgSyncApi (data) {
  return service.post('/index/sendSync', data)
}

export function sendMsgAsyncApi (data) {
  return service.post('/index/sendAsync', data)
}

export function getOnlineUser () {
  return service.get('/index/users')
}

export function connect (username, success, fail, onOpen, onMessage, onClose) {
  let ws = null
  let baseUrl = process.env.BASE_URL.split('//')[1]
  if (username != null && username !== '') {
    if ('WebSocket' in window) {
      ws = new WebSocket('ws://' + baseUrl + '/socketServer/' + username)
      success(ws)
    } else if ('MozWebSocket' in window) {
      ws = new MozWebSocket('ws://' + baseUrl + '/socketServer/' + username)// eslint-disable-line
      success(ws)
    } else {
      alert('该浏览器不支持websocket')
      fail()
      return
    }
    ws.onmessage = function (evt) {
      onMessage(evt)
    }
    ws.onclose = onClose
    ws.onopen = onOpen
  } else {
    alert('请输入您的Id')
  }
}
