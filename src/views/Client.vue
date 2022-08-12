<template>
  <div class="layui-row">
    <div class="divright">
      <div slot="header" class="box" style="height: 45px;">
        <div style="width:100px;margin-top: 10px;margin-right: 20px; float: left;padding: 0px 20px;">
          <span>在线列表</span>
        </div>
        <el-button style="float: right; padding: 3px 0;margin-right: 20px;margin-top: 10px" type="text"
                   v-on:click="freshUsers()">刷新
        </el-button>
      </div>
      <el-scrollbar class="box" style="height: 350px;width: 300px;">
        <!-- 具体要包裹的内容 -->
        <div style="width: 300px;text-align: left;">
          <div v-for="usr in userList" :key="usr">
            <div class="text item" v-on:click="clickUser"> {{ usr }}</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="divmid">
      <div class="box" style="width: 300px; height: 400px">
        <h1 style="text-align: center">客户端</h1>
        <div class="demo-input-suffix" style="width: 210px;height: 150px; margin-left: 40px; ">
          ID信息：
          <el-row>
            <el-input
              placeholder="请输入源ID"
              v-model="username" :disabled="disabled">
            </el-input>
            <div style="margin-top: 20px;margin-left: 75px;">
              <el-button v-on:click="clickConnect()" type="success" :disabled="disabled">连接</el-button>
            </div>
          </el-row>
        </div>
        <div class="layui-input-inline" style="width: 210px;margin-left: 40px; margin-top: 10px">
          发送内容
          <el-input style="padding-bottom: 5px"
                    placeholder="请输入目的ID"
                    v-model="target">
          </el-input>
          <el-input v-model="message" placeholder="请输入内容"></el-input>
        </div>
        <div class="layui-input-inline1" style="width: 300px;margin-left: 40px; margin-top: 20px">
          <el-row>
            <el-button v-on:click="sendAsyncMsg" type="success">异步发送</el-button>
<!--            <el-button v-on:click="test" type="success">异步发送</el-button>-->
            <el-button v-on:click="sendSyncMsg" type="primary">同步发送</el-button>
          </el-row>
        </div>
      </div>
    </div>
    <div class="divleft">
      <div slot="header" class="box" style="width: 100%;height: 45px;">
        <div style=" width:100px;float: left;margin-left: 20px; padding: 12px 0px;">
          <span>消息列表</span>
        </div>
        <el-button style="float: right;margin-right: 20px;" type="text" v-on:click="clickClear()">清空</el-button>
      </div>
      <el-scrollbar class="box" style="height: 350px;width: 500px;">
        <!-- 具体要包裹的内容 -->
        <div style="width: 500px;text-align: left;">
          <ul v-for="msg in msgList" :key="msg">
            <li class="text item"> {{ msg.user + ': ' + msg.msg }}</li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </div>

</template>

<script>
import Global from '../components/Global'
// import {connect} from '../request/api'
// import {getOnlineUser, connect, sendMsgAsyncApi, sendMsgSyncApi} from '../request/api.js'
import {getOnlineUser, connect, sendMsgAsyncApi, sendMsgSyncApi} from '../request/indexApi'

export default {
  name: 'Client',
  data () {
    return {
      disabled: false,
      message: '',
      username: '',
      target: '',
      userList: [],
      msgList: []
    }
  },
  created () {
    let userName = this.$route.params.userId
    console.log(userName)
  },
  methods: {
    sendSyncMsg () {
      let that = this
      let msg = {
        text: that.message,
        source: that.username,
        target: that.target,
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
      // eslint-disable-next-line no-undef
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
          that.msgList.push({
            user: res_message.source,
            msg: res_message.text
          })
        }
      })
    },
    sendAsyncMsg () {
      var that = this
      let msg = {
        text: that.message,
        source: that.username,
        target: that.target,
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
        console.log(res)
      })
    },
    clickConnect () {
      let that = this
      let ws = Global.ws
      // eslint-disable-next-line no-undef
      connect(this.username, function (websocket) {
        Global.ws = websocket
        ws = websocket
        that.disabled = true
      }, function () {
        console.log('连接失败')
      }, function () {
      }, function (evt) {
        console.log(evt.data)
        let res = JSON.parse(evt.data)
        if (res.type === 1) {
          that.userList = res.data
          that.$message({
            type: 'success',
            message: res.text
          })
        } else {
          that.msgList.push({
            user: res.source,
            msg: res.text
          })

          if (res.sync === true) {
            let name = res.source
            that.$prompt('请您回复', '来自' + name + '的同步消息:' + res.text, {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({value}) => {
              let msg = res
              msg.response = true
              let source = msg.source
              msg.source = msg.target
              msg.target = source
              msg.text = value
              ws.send(JSON.stringify(msg))
              that.$message({
                type: 'success',
                message: '回复成功'
              })
            }).catch(() => {
              let msg = res
              msg.response = true
              let source = msg.source
              msg.source = msg.target
              msg.target = source
              msg.type = 2
              ws.send(JSON.stringify(msg))
              that.$message({
                type: 'info',
                message: '取消回复'
              })
            })
          }
        }
      }, function () {
      })
    },
    clickUser (e) {
      this.target = e.currentTarget.innerText
    },
    clickClear () {
      this.msgList = []
    },
    freshUsers () {
      // eslint-disable-next-line no-undef
      getOnlineUser().then((res) => {
        res = res.data
        if (res.code === 1) {
          this.userList = res.data
        } else {
          this.$notify.error({
            title: '错误',
            message: '刷新失败'
          })
        }
      })
    },
    checkData () {
      let ws = Global.ws
      if (ws == null) {
        alert('客户端未连接')
        return false
      }
      if (this.target === '') {
        this.$notify.error({
          title: '错误',
          message: '未输入目的用户'
        })
        return false
      }
      if (this.userList.indexOf(this.target) === -1) {
        this.$notify.error({
          title: '错误',
          message: '用户未上线'
        })
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.divright {
  float: right;
  width: 300px;
  height: 400px;
  margin-right: 100px;
  margin-top: 150px;
}

.divmid {
  float: right;
  width: 320px;
  margin-right: 20px;
  margin-top: 125px;
}

.divleft {
  float: right;
  width: 500px;
  height: 400px;
  margin-right: 20px;
  margin-top: 150px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  margin-right: 10px;
}

.box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

</style>
