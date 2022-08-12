<script>
import multiavatar from '@multiavatar/multiavatar'

export default {
  data () {
    return {
      avatar: '',
      name: ''
    }
  },
  created () {
    let userName = this.$route.params.userId
    this.name = userName
    this.avatar = multiavatar(userName)
  },
  methods: {
    onKeyup (e) {
      this.search(e.target.value)
    },
    onDelete () {
      this.$EventBus.$emit('cardDelete')
    },
    onFresh () {
      this.$EventBus.$emit('cardFresh')
    }
  }
}
</script>

<template>
  <div class="card">
    <header>
      <div class="avatar" v-html="avatar"></div>
      <p class="name">{{ this.name }}</p>
    </header>
    <footer>
      <el-row style="margin-top: 15px;">
        <i v-on:click="onFresh" class="el-icon-refresh-left" style="float: right;margin-right: 10px;"></i>
        <i v-on:click="onDelete" class="el-icon-delete" style="float: right;margin-right: 10px;"></i>
      </el-row>
    </footer>
  </div>
</template>

<style scoped>
.card {
  padding: 12px;
  border-bottom: solid 1px #24272C;
}

.card footer {
  margin-top: 10px;
}

.card .avatar,
.card .name {
  vertical-align: middle;
}

.card .avatar {
  height: 40px;
  width: 40px;
  border-radius: 2px;
  float: left;
}

.card .name {
  display: inline-block;
  margin: 0 0 0 15px;
  font-size: 16px;
}

.card .search {
  padding: 0 10px;
  width: 100%;
  font-size: 12px;
  color: #fff;
  height: 30px;
  line-height: 30px;
  border: solid 1px #3a3a3a;
  border-radius: 4px;
  outline: none;
  background-color: #26292E;
}

.card.avtart-block {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
</style>
