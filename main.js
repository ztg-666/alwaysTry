// 设置页脚年份
const yearSpan = document.getElementById("year");
yearSpan.textContent = new Date().getFullYear().toString();

// 按钮点击事件
const ctaBtn = document.getElementById("cta-btn");
ctaBtn.addEventListener("click", () => {
  alert("你已经成功触发了一个 JS 事件！");
});

// 表单提交事件
const form = document.getElementById("contact-form");
const result = document.getElementById("form-result");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // 阻止默认提交（因为是静态网站，没有后端）

  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!email || !message) {
    result.textContent = "请填写完整信息。";
    result.classList.remove("hidden");
    result.style.color = "red";
    return;
  }

  // 在纯静态站里，你可以把数据发到第三方服务（如表单服务），
  // 这里先简单模拟“发送成功”
  result.textContent = "感谢你的留言！由于这是静态网站，暂时不会真正发送哦～";
  result.classList.remove("hidden");
  result.style.color = "green";

  // 清空表单
  form.reset();
});
