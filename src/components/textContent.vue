<script>
import {getOnlineUser, connect, sendMsgAsyncApi, sendMsgSyncApi} from '../request/indexApi'
import Global from '../components/Global'
import multiavatar from '@multiavatar/multiavatar'

export default {
  data () {
    return {
      message: '',
    }
  },
  methods: {
    sendSyncMsg () {
      let that = this
      let msg = {
        text: that.message,
        source: Global.storage.userId,
        target: that.$root.currentId,
        sync: true,
        response: false
      }
      // msg = JSON.stringify(msg)
      console.log(msg)
      if (!this.checkData()) {
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      sendMsgSyncApi(msg).then((res) => {
        console.log(res)
        loading.close()
        res = res.data
        // eslint-disable-next-line camelcase
        let res_message = res.data
        if (res.msg === 'timeout') {
          that.$notify.error({
            title: '错误',
            message: '对方回复超时'
          })
        } else if (res_message.type === 2) { //
          that.$notify.error({
            title: '错误',
            message: '对方取消回复'
          })
        } else {
          that.$message({
            message: '收到回复',
            type: 'success'
          })
          Global.ON_MESSAGE(res_message.source, res_message.text)
        }
      })
      Global.SEND_MESSAGE(that.$root.currentId, that.message)
      that.message = ''
    },
    sendAsyncMsg () {
      var that = this
      let msg = {
        text: that.message,
        source: Global.storage.userId,
        target: that.$root.currentId,
        sync: false,
        response: false
      }
      // msg = JSON.stringify(msg)
      console.log(msg)
      if (!this.checkData()) {
        return
      }
      // eslint-disable-next-line no-undef
      sendMsgAsyncApi(msg).then((res) => {
        Global.SEND_MESSAGE(that.$root.currentId, that.message)
        that.message = ''
      })
    },
    checkData () {
      let ws = Global.ws
      if (ws == null) {
        alert('客户端未连接')
        return false
      }
      return true
    },

  }
}
</script>

<template>
  <div>
    <div class="text">
      <textarea placeholder="请输入发送内容" v-model="message"></textarea>
    </div>
    <div class="btn">
      <el-row>
        <el-button v-on:click="sendAsyncMsg" type="success" size="mini" icon="el-icon-sort-up" circle></el-button>
        <el-button v-on:click="sendSyncMsg" type="primary" size="mini" icon="el-icon-sort" circle></el-button>
      </el-row>
    </div>
  </div>


</template>

<style scoped>
.text {
  height: 130px;
  border-top: solid 1px #ddd;
}
.btn{
  float: right;
  margin-right: 10px;
  padding-bottom: 100px;
}

.text textarea {
  padding-top: 10px;
  height: 120%;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
}

</style>
