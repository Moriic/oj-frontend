<template>
  <div v-if="showPopup" class="popup">
    <div class="popup-content">
      <span class="close-btn" @click="closePopup">&times;</span>
      <h2>添加代办事项</h2>
      <input type="text" v-model="newTask" placeholder="请输入代办事项" />
      <button @click="saveTask">保存任务</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['showPopup'],
  data() {
    return {
      newTask: '',
    }
  },
  methods: {
    closePopup() {
      this.$emit('close-popup')
    },
    saveTask() {
      //发送存储请求
    },
  },
}
</script>

<style scoped>
.popup {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 300px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}
</style>
