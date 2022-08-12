<script>

import Global from '../components/Global'
import {getOnlineUser} from '../request/indexApi'
import multiavatar from '@multiavatar/multiavatar'

export default {
  data () {
    return {
      userList: [],
      currentId: ''
    }
  },
  beforeCreate () {
    let that = this;
    this.$EventBus.$on('cardDelete', function (arg) {
      that.userList = []
    })
    this.$EventBus.$on('cardFresh', function (arg) {
      that.freshUsers()
      that.userList = Global.storage.userStorage
    })
  },
  created () {
    this.userList = Global.storage.userStorage
  },
  watch: {
    '$root.onAndOff': {
      handler (newId, oldId) {
        this.userList = Global.storage.userStorage
        this.freshUsers()
      },
      deep: true
    },
  },
  methods: {
    onKeyup (e) {
      this.search(e.target.value)
    },
    selectSession (id) {
      this.currentId = id
      this.$root.currentId = id
    },
    freshUsers () {
      getOnlineUser().then((res) => {
        res = res.data
        if (res.code === 1) {//成功返回
          let arr = Global.storage.userStorage.map(obj => {
            return obj.id
          })
          res.data.forEach((item) => {
            if (arr.indexOf(item) === -1) {
              Global.storage.userStorage.push({
                id: item,
                avatar: multiavatar(item),
                messages: []
              })
            }
          })
          let arr_remote = res.data
          Global.storage.userStorage.forEach((item) => {
            if (arr_remote.indexOf(item.id) === -1) {//本地id在不在remote里
              Global.storage.userStorage.splice(Global.storage.userStorage.indexOf(item), 1)
            }
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '刷新失败'
          })
        }
      })
    },
  }
}
</script>

<template>
  <div class="list">
    <ul>
      <li v-for="(user,index) in userList" :key="index" :class="{ active: user.id === currentId }"
          @click="selectSession(user.id)">
        <div class="avatar" v-html="user.avatar"></div>
        <p class="name">{{ user.id }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list li {
  padding: 12px 15px;
  border-bottom: 1px solid #292C33;
  cursor: pointer;
  transition: background-color .1s;
}

.list li:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.list li.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.list .avatar,
.list .name {
  vertical-align: middle;
}

.list .avatar {
  height: 30px;
  width: 30px;
  border-radius: 2px;
  float: left;
}

.list .name {
  display: inline-block;
  margin: 0 0 0 15px;
}

</style>
