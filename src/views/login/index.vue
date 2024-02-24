<script setup lang="ts">
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRaw,
  watch
} from "vue";
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import phone from "./components/phone.vue";
import TypeIt from "@/components/ReTypeit";
import qrCode from "./components/qrCode.vue";
import register from "./components/register.vue";
import resetPassword from "./components/resetPassword.vue";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { operates, thirdParty } from "./utils/enums";
import { useLayout } from "@/layout/hooks/useLayout";
import { rsaEncrypt } from "@/utils/crypt";
import { getTopMenu, initRouter } from "@/router/utils";
import { avatar, bg, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import {
  getIsRememberMe,
  getPassword,
  removePassword,
  saveIsRememberMe,
  savePassword,
  setTokenFromBackend
} from "@/utils/auth";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import * as CommonAPI from "@/api/common/login";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "Login"
});

// TODO 当请求验证码过于频繁的话  服务器会报错  但是前端没有反应 这块需要处理一下, 通过axios处理一下
const captchaCodeBase64 = ref("");

const isCaptchaOn = ref(false);

const router = useRouter();
const loading = ref(false);
const isRememberMe = ref(false);
const ruleFormRef = ref<FormInstance>();
// 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
const currentPage = ref(0);

const { initStorage } = useLayout();
initStorage();
const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
// const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { title } = useNav();
console.log("🚀 ~ title:", title);

const ruleForm = reactive({
  username: "admin",
  password: getPassword(),
  captchaCode: "",
  captchaCodeKey: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      CommonAPI.loginByPassword({
        username: ruleForm.username,
        password: rsaEncrypt(ruleForm.password),
        captchaCode: ruleForm.captchaCode,
        captchaCodeKey: ruleForm.captchaCodeKey
      })
        .then(({ data }) => {
          // 登录成功后 将token存储到sessionStorage中
          setTokenFromBackend(data);
          // 获取后端路由
          initRouter().then(() => {
            router.push(getTopMenu(true).path);
            message("登录成功", { type: "success" });
          });
          if (isRememberMe.value) {
            savePassword(ruleForm.password);
          }
        })
        .catch(() => {
          loading.value = false;
          //如果登陆失败则重新获取验证码
          getCaptchaCode();
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

async function getCaptchaCode() {
  if (isCaptchaOn.value) {
    await CommonAPI.getCaptchaCode().then(res => {
      // captchaCodeBase64.value = `data:image/gif;base64,${res.data.captchaCodeImg}`;
      captchaCodeBase64.value = `${res.data.captchaCodeImg}`;
      ruleForm.captchaCodeKey = res.data.captchaCodeKey;
    });
  }
}

watch(isRememberMe, newVal => {
  saveIsRememberMe(newVal);
  if (newVal === false) {
    removePassword();
  }
});

onBeforeMount(async () => {
  await CommonAPI.getConfig().then(res => {
    isCaptchaOn.value = res.data.isCaptchaOn;
    useUserStoreHook().SET_DICTIONARY(res.data.dictionary);
  });

  await getCaptchaCode();

  isRememberMe.value = getIsRememberMe();
  if (isRememberMe.value) {
    ruleForm.password = getPassword();
  }
});

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="absolute flex-c right-5 top-3">
      <!-- 主题 -->
      <!-- <el-switch
        v-model="dataTheme"
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        inline-prompt
        @change="dataThemeChange"
      />
      -->
    </div>
    <div class="login-container">
      <div class="img">
        <!-- 登录页面的背景图 -->
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <!-- 登录窗口上面的LOGO -->
          <!-- <avatar class="avatar" />-->
          <!-- TODO -->
          <img src="@/assets/images/logo_round_icon.png" />
          <Motion>
            <h2 class="outline-none">
              <TypeIt :cursor="false" :speed="150" :values="[title]" />
            </h2>
          </Motion>

          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  :prefix-icon="useRenderIcon(User)"
                  clearable
                  placeholder="账号"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  :prefix-icon="useRenderIcon(Lock)"
                  clearable
                  placeholder="密码"
                  show-password
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item v-if="isCaptchaOn" prop="captchaCode">
                <el-input
                  v-model="ruleForm.captchaCode"
                  :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                  clearable
                  placeholder="验证码"
                >
                  <template v-slot:append>
                    <el-image
                      :src="captchaCodeBase64"
                      style="
                        justify-content: center;
                        width: 120px;
                        height: 40px;
                      "
                      @click="getCaptchaCode"
                    >
                      <template #error>
                        <span>Loading</span>
                      </template>
                    </el-image>
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-checkbox v-model="isRememberMe"> 记住密码</el-checkbox>
                  <el-button link type="primary" @click="currentPage = 4">
                    忘记密码
                  </el-button>
                </div>
                <el-button
                  :loading="loading"
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  @click="onLogin(ruleFormRef)"
                >
                  登录
                </el-button>
              </el-form-item>
            </Motion>

            <!-- <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click="currentPage = item.page"
                  >
                    {{ item.title }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion> -->
          </el-form>

          <!-- <Motion v-if="currentPage === 0" :delay="350">
            <el-form-item>
              <el-divider>
                <p class="text-xs text-gray-500">{{ "第三方登录" }}</p>
              </el-divider>
              <div class="flex w-full justify-evenly">
                <span
                  v-for="(item, index) in thirdParty"
                  :key="index"
                  :title="item.title"
                >
                  <IconifyIconOnline
                    :icon="`ri:${item.icon}-fill`"
                    class="text-gray-500 cursor-pointer hover:text-blue-400"
                    width="20"
                  />
                </span>
              </div>
            </el-form-item>
          </Motion> -->
          <!-- 手机号登录 -->
          <!-- <phone v-if="currentPage === 1" v-model:current-page="currentPage" /> -->
          <!-- 二维码登录 -->
          <!-- <qrCode v-if="currentPage === 2" v-model:current-page="currentPage" /> -->
          <!-- 注册 -->
          <register
            v-if="currentPage === 3"
            v-model:current-page="currentPage"
          />
          <!-- 忘记密码 -->
          <resetPassword
            v-if="currentPage === 4"
            v-model:current-page="currentPage"
          />
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="flex items-center justify-center h-full">
      <div class="flex flex-col items-center justify-center mb-3">
        <span>Copyright © 2018-2023 qiwu All Rights Reserved. </span>
        <el-link
          href="https://beian.miit.gov.cn"
          rel="external nofollow"
          target="_blank"
          type="primary"
          >闽ICP备2022018106号-2
        </el-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.login-form {
  img {
    margin: 0 auto;
    width: 60px;
  }
}
</style>
