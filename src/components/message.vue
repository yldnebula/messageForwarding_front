<script>
import Global from '../components/Global'
import multiavatar from '@multiavatar/multiavatar'

export default {
  data () {
    return {
      userList: [],
      currentId: '',
      session: {},
      targetAvatar: '',
      selfAvatar: ''
    }
  },
  created () {
    this.currentId = Global.storage.currentId
    this.session = Global.storage.userStorage.find(item => item.id === Global.storage.currentId)
    // this.targetAvatar = this.session.avatar
    // this.selfAvatar = Global.storage.avatar
    this.storage = Global.storage
  },
  methods: {},
  watch: {
    '$root.currentId': {
      handler (newId, oldId) {
        this.session = Global.storage.userStorage.find(item => item.id === newId)
        this.currentId = newId
        this.targetAvatar = this.session.avatar
        this.selfAvatar = Global.storage.avatar
      },
      deep: true
    },
  },
  filters: {
    // 将日期过滤为 hour:minutes
    time (date) {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      return date.getHours() + ':' + date.getMinutes()
    }
  },
  directives: {
    // 发送消息后滚动到底部
    'scroll-bottom' () {
      this.vm.$nextTick(() => {
        this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight
      })
    }
  }
}
</script>

<template>
  <div class="message">
    <ul v-if="session">
      <li v-for="(item,index) in session.messages" :key="index">
        <p class="time">
          <span>{{ item.date | time }}</span>
        </p>
        <div class="main" :class="{ self: item.self }">
          <div v-html="item.self ? selfAvatar : targetAvatar" class="avatar"></div>
          <img
            :src="item.file"
            alt
            class="file"
            v-if="item.file"
            @load=""
            preview="1"
          />
          <div class="text" v-else>{{ item.content }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.message {
  padding: 10px 15px;
  overflow-y: scroll;
}

.message li {
  margin-bottom: 15px;
  list-style: none;
}

.message .time {
  margin: 7px 0;
  text-align: center;
}

.message .time > span {
  display: inline-block;
  padding: 0 18px;
  font-size: 12px;
  color: #fff;
  border-radius: 2px;
  background-color: #dcdcdc;
}

.message .avatar {
  float: left;
  margin: 0 10px 0 0;
  border-radius: 3px;
  width: 30px;
  height: 30px;
}

.message .file{
  max-width: 330px;
  max-height: 170px;
  margin-top: 14px;
  margin-left: 10px;
  cursor: pointer;
}

.message .text {
  display: inline-block;
  position: relative;
  padding: 0 10px;
  max-width: calc(100% - 40px);
  min-height: 30px;
  line-height: 2.5;
  font-size: 12px;
  text-align: left;
  word-break: break-all;
  background-color: #fafafa;
  border-radius: 4px;
}

.message .text:before {
  content: " ";
  position: absolute;
  top: 9px;
  right: 100%;
  border: 6px solid transparent;
  border-right-color: #fafafa;
}

.message .self {
  text-align: right;
}

.message .self .avatar {
  float: right;
  margin: 0 0 0 10px;
}

.message .self .text {
  background-color: #b2e281;
}

.message .self .text:before {
  right: inherit;
  left: 100%;
  border-right-color: transparent;
  border-left-color: #b2e281;
}

</style>
