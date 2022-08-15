<script>
import {getOnlineUser, connect, sendMsgAsyncApi, sendMsgSyncApi} from '../request/indexApi'
import Global from '../components/Global'
import multiavatar from '@multiavatar/multiavatar'

export default {
  data () {
    return {
      message: '',
      inputAsync: '',
      inputSync: ''
    }
  },
  methods: {
    sendSyncMsg (e, data, limit) {
      let that = this
      let msg = {
        text: that.message,
        source: Global.storage.userId,
        target: that.$root.currentId,
        data: data,
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
      sendMsgSyncApi(msg, limit).then((res) => {
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
      if(res.data.code === 1){
        Global.SEND_MESSAGE(that.$root.currentId, that.message, data)
      }else{
        that.$message({
          type: 'error',
          message: res.data.msg
        })
      }
      that.message = ''
    },
    sendAsyncMsg (e, data, limit) {
      var that = this
      let msg = {
        text: that.message,
        source: Global.storage.userId,
        target: that.$root.currentId,
        data: data,
        sync: false,
        response: false
      }
      // msg = JSON.stringify(msg)
      console.log(msg)
      if (!this.checkData()) {
        return
      }
      // eslint-disable-next-line no-undef
      sendMsgAsyncApi(msg, limit).then((res) => {
        console.log(res)
        if(res.data.code === 1){
          Global.SEND_MESSAGE(that.$root.currentId, that.message, data)
        }else{
          that.$message({
            type: 'error',
            message: res.data.msg
          })
        }
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
    handleFileSync (){
      alert('sync')
    },
    handleFileAsync (){
      alert('async')

    },
    handleImg (e, imgUrl, isSync) {
      isSync?this.sendSyncMsg(e,imgUrl,true):this.sendAsyncMsg(e,imgUrl,true)
      // this.sendAsyncMsg(imgUrl)
    },
    handleFile(event, isSync){
      let file = event.target.files[0]
      let reader = new FileReader() // 创建读取文件对象
      reader.readAsDataURL(file) // 发起异步请求，读取文件
      reader.onload = (e) => {
        // 文件读取完成后
        // 读取完成后，将结果赋值给img的src
        this.handleImg(e, e.target.result, isSync)
        event.target.value = ''
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="icon">
      <label class="el-icon-picture iconfont icon-tupian" for="fileSync"></label>
      <input type="file" style="display:none" id="fileSync" @change="handleFile($event, true)" />
      <label class="el-icon-picture-outline iconfont icon-tupian" for="file"></label>
      <input type="file" style="display:none" id="file" @change="handleFile($event, false)" />
      <i class="iconfont el-icon-sort-up icon-tupian" v-on:click="sendAsyncMsg($event)" ></i>
      <i class="iconfont el-icon-sort icon-tupian" v-on:click="sendSyncMsg($event)" ></i>
    </div>
    <div class="text">
      <textarea placeholder="请输入发送内容" v-model="message"></textarea>
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
.icon{
  height: 25px;
  padding-top: 6px;
  display: flex;
  float: right;
}

.icon .iconfont {
  float: right;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon .icon-tupian{
  font-size: 20px;
  padding: 0 6px;
  cursor: pointer;
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
