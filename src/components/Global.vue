<script>
import multiavatar from '@multiavatar/multiavatar'

let ws = null
let storage = {
  userId: '',
  avatar: '',
  userStorage: [
  ],

  currentId: ''
}
let SEND_MESSAGE = function (currentId, content, file) {
  let store = this.storage.userStorage.find(item => item.id === currentId)
  if (!store) {
    this.storage.userStorage.push({
      id: currentId,
      avatar: multiavatar(currentId),
      messages: []
    })
  }
  this.storage.userStorage.find(item => item.id === currentId).messages.push({
    content: content,
    date: new Date(),
    file: file,
    self: true
  })
}
let ON_MESSAGE = function (sourceId, content, file) {
  let store = this.storage.userStorage.find(item => item.id === sourceId)
  if (!store) {
    this.storage.userStorage.push({
      id: sourceId,
      avatar: multiavatar(sourceId),
      messages: []
    })
  }
  this.storage.userStorage.find(item => item.id === sourceId).messages.push({
    content: content,
    date: new Date(),
    file: file,
    self: false
  })
}

export default {
  ws,
  storage,
  SEND_MESSAGE,
  ON_MESSAGE
}
</script>
