<template>
  <div class="onlyChat-container">
    <el-button type="primary" @click="sentCustomMessage">{{ a }}</el-button>
    <TUIKit
      :SDKAppID="1600091455"
      :userID="userInfolist[a].userID"
      :userSig="userInfolist[a].userSig"
      conversationID="GROUP@TGS#2LENM77QK"
    >
      <TUIChat></TUIChat>
      <TUIGroup />
    </TUIKit>
  </div>
</template>
<script lang="ts" setup>
import { TUIKit, TUIChat, TUIGroup, hideTUIChatFeatures } from "@/TUIKit";
import { TUIChatService } from "@tencentcloud/chat-uikit-engine";

const sentCustomMessage = () => {
  let promise = TUIChatService.sendCustomMessage({
    payload: {
      data: JSON.stringify({
        // 评价类消息标识字段
        businessID: "important",
        text: "test",
      }),
      description: "对本次的服务评价",
      extension: "对本次的服务评价",
    },
  });
  promise.catch((error) => {
    // 调用异常时业务侧可以通过 promise.catch 捕获异常进行错误处理
  });
};
hideTUIChatFeatures([
  "ForwardMessage",
  "TranslateMessage",
  "MultiSelection",
  "InputStickers",
  "InputEvaluation",
  "InputQuickReplies",
  "InputMention",
  "MessageSearch",
  "ReadStatus",
]);

const userInfolist = [
  {
    userID: "webuser1",
    userSig:
      "eJwtzFELgjAYheH-suuQObamQjcFoWgYWCHdKfuMLzHGtBZG-72lXp7nhfMhp6zwXmBIRJhHyWraqOAxYIMTW6ifPRh-ab1qK61RkchfU0pDnwsxF3hrNOBcCMFcmnXA7m*ShzJgkrHlBW-uOk*7UpXHOGktXLCx9VjBGLBtnGfXgzrf8z0tdpKnlU425PsD9N4ytg__",
  },
  {
    userID: "androiduser1",
    userSig:
      "eJwtzL0OgjAYheF76YrBtvJZIXFwwoGoQfEvLiUt5osBSYvaaLx3ERjP8ybnQ3bJ1n9qQyLCfUpG3UalqwYL7FhWytxRPaw2bOhW3WRdoyIRm1JKQxYA9EW7Go1uHQB4m3ptsPybCEIx40IEwwte2-vkAJdxKU-N*e32LM2t9fJJRR1z2YKnq9hbF2azjPPsCK85*f4AKCg0Zg__",
  },
  {
    userID: "iosuser1",
    userSig:
      "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwpn5xaXFqUWGULnilOzEgoLMFCUrQzMDAwNLQxNTU4hMakVBZlEqUNzU1NQIKAURLcnMBYmZm1iaWxhZGJhDTclMBxrtGJnv7WSSXGZcnllZHJ7oHlhs7mkeo1*REprtEWJS6O*ZbpHhYZkTVRiinW6rVAsAI*YzCQ__",
  },
];

const randomID = () => {
  return Math.floor(Math.random() * 2);
};
const a = randomID();
</script>
<style lang="scss" scoped>
.onlyChat-container {
  .chat {
    height: calc(100vh - 100px);
  }
  .tui-group {
    width: 400px;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
<style lang="scss">
/* 聊天头部 */
.tui-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #409effa3;
  border-bottom: none;
  font-size: 16px;
  font-weight: 500;
}
</style>
