<script>
import Card from '../components/card'
import List from '../components/list'
import textContent from '../components/textContent'
import Message from '../components/message'
import Global from '../components/Global'
import {connect} from '../request/indexApi'
import multiavatar from '@multiavatar/multiavatar'

export default {

  name: 'Client2',
  components: {Card, List, textContent, Message},
  mounted () {
    this.username = this.$route.params.userId
    this.clickConnect()
  },
  data () {
    return {
      username: '',
    }
  },
  methods: {
    clickConnect () {
      let that = this
      let ws = Global.ws
      // eslint-disable-next-line no-undef
      connect(this.username, function (websocket) {
        Global.ws = websocket
        ws = websocket
      }, function () {
        console.log('连接失败')
      }, function () {
        Global.storage = {}
        Global.storage.userId = that.username
        Global.storage.avatar = multiavatar(that.username)
        Global.storage.userStorage = []
        Global.storage.currentId = ''
        that.$root.onAndOff = !that.$root.onAndOff
        console.log(Global.storage)
      }, function (evt) {
        // console.log(evt.data)
        let res = JSON.parse(evt.data)
        if (res.type === 3 || res.type === 4) {
          that.$root.onAndOff = !that.$root.onAndOff
          that.$message({
            type: 'success',
            message: res.text
          })
        } else {
          Global.ON_MESSAGE(res.source, res.text, res.data)
          that.$root.onAndOff = !that.$root.onAndOff
          console.log(Global.storage)
          if (res.sync === true) {
            let name = res.source
            let contentText = res.text
            let isFile = false
            if(res.data!=null&&res.data!==''){
              contentText = '图片消息'
              isFile = true
            }
            that.$prompt('请您回复', '来自' + name + '的同步消息:' + contentText, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({value}) => {
              let msg = res
              msg.response = true
              let source = msg.source
              msg.source = msg.target
              msg.target = source
              msg.text = value
              msg.data = null
              ws.send(JSON.stringify(msg))
              that.$message({
                type: 'success',
                message: '回复成功'
              })
              Global.SEND_MESSAGE(msg.target, value)
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
            // let timer = setTimeout(function (){
            //   document.getElementsByClassName("el-message-box__wrapper")[0].attributes.getNamedItem('style').value+="display:none;";
            //   document.getElementsByClassName("v-modal")[0].attributes.getNamedItem('style').value+="display:none;";
            //   that.$message({
            //     type: 'info',
            //     message: '回复超时'
            //   })
            // },30000)
          }
        }
      }, function () {
      })
    },
  }
}
</script>

<template>
  <div class="home">
    <div id="client">
      <div class="sidebar">
        <card></card>
        <list></list>
      </div>
      <div class="main">
        <div class="message">
          <message></message>
        </div>
        <div class="content">
          <textContent></textContent>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.home {
  width: 100%;
  height: 100vh;
  background: url("../assets/bg.jpg") center center repeat;
  background-size: 100% 100%;
  position: fixed;
}

#client {
  margin: 20px auto;
  width: 800px;
  height: 600px;
  overflow: hidden;
  border-radius: 3px;
}

#client .sidebar,
#client .main {
  height: 100%;
}

#client .sidebar {
  float: left;
  width: 200px;
  color: #f4f4f4;
  background-color: #2e3238;
}

#client .main {
  position: relative;
  overflow: hidden;
  background-color: #eee;
}

#client .content {
  position: absolute;
  background-color: #eee;
  width: 100%;
  height: 160px;
  bottom: 0;
  left: 0;
}

#client .message {
  height: 85%;
}

</style>
