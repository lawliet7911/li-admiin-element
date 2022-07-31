<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { checkPwd } from '~/api/user';
import { useUserState } from '~/store';
import { TOAST_DURATION } from '~/utils/request';
import { useLiStorage } from '~/utils/shared';

let rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

interface userData {
  username: string
  pwd: string | number
}

const form = ref<userData>({
  username: '',
  pwd: ''
})

const loginOptions = ref({
  remember: false,
  exp: 15
})

const loginForm: any = ref<FormInstance>()
const router = useRouter()
const userState = useUserState()
const login = (formRef: FormInstance): void => {
  formRef.validate(async (flag: boolean) => {
    if (!flag) return
    let params = {
      ...form.value
    }
    let { data } = await checkPwd(params)
    if (data.length) {
      let d = data[0]
      delete d.pwd
      userState.setUser(d)
      if (loginOptions.value.remember) useLiStorage.set('user', d, loginOptions.value.exp * 24)
      router.push({ name: 'Home' })
    } else {
      ElMessage({
        type: 'error',
        duration: TOAST_DURATION * 1000,
        message: '用户名或密码错误',
      })
    }
  })
}

</script>

<template>
  <div class="main-login">
    <div class="login-box">
      <div class="login-b-l"></div>
      <div class="login-b-r">
        <div class="system-title">
          <el-icon class="title-icon" :size="30">
            <carbon-webhook />
          </el-icon>
          <span class="title-text">登录</span>
        </div>
        <el-form :model="form" class="login-form" :rules="rules" ref="loginForm">
          <el-form-item class="form-item" label="用户名" prop="username" label-width="80px">
            <el-input v-model.trim="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item class="form-item" label="密码" prop="pwd" label-width="80px">
            <el-input v-model.trim="form.pwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item class="form-item">
            <el-checkbox v-model="loginOptions.remember">记住密码</el-checkbox>
            <el-select class="sel-exp" placeholder="保存天数" v-show="loginOptions.remember" v-model="loginOptions.exp">
              <el-option label="15天" :value="15"></el-option>
              <el-option label="30天" :value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button class="login-btn" @click="login(loginForm)" type="primary">登录</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 620px;
    height: 450px;
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-bg-color);
    color: var(--el-text-color-primary);
    border-radius: var(--el-border-radius-round);
    display: flex;
  }

  .login-b-l {
    flex: 1;
    background-color: var(--el-color-info-light-8);
  }

  .login-b-r {
    box-sizing: border-box;
    padding: 30px;
    width: 360px;
    text-align: center;
  }

  .title-icon {
    transform: rotate(0) scale(1);
    transition: all var(--el-transition-duration);

    &:hover {
      transform: rotate(360deg) scale(1.3);
      transition: all var(--el-transition-duration);
    }
  }

  @keyframes icon-rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  .system-title {
    font-size: var(--el-font-size-large);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title-text {
    margin-left: 10px;
  }

  .login-form {
    margin-top: 50px;
  }

  .form-item {
    margin-bottom: 30px;
  }

  .sel-exp {
    margin-left: 20px;
  }

  .login-btn {
    margin: 0 auto;
    width: 280px;
  }
}
</style>