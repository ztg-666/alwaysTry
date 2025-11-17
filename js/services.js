// ==================== services.js - 健康服务页脚本 ====================

// Smooth scroll 到目标元素
function smoothScrollTo(el, offset = 0) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.pageYOffset + rect.top + offset;
    window.scrollTo({ top, behavior: 'smooth' });
}

// 简单手机校验（支持 11 位数字或带空格/短横线分隔）
function isValidPhone(phone) {
    if (!phone) return false;
    const cleaned = phone.replace(/[^\d]/g, '');
    return cleaned.length >= 7 && cleaned.length <= 15;
}

// 从 URL 读取查询参数
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// 将服务按钮映射到 select 的值
function mapServiceTitleToValue(title) {
    const t = (title || '').toLowerCase();
    if (t.includes('图文') || t.includes('问诊') || t.includes('咨询') && !t.includes('心理')) return 'consult';
    if (t.includes('体检')) return 'checkup';
    if (t.includes('慢病')) return 'chronic';
    if (t.includes('心理')) return 'psychology';
    return '';
}

// 反向：将 select 值映射为中文名称
function mapValueToLabel(val) {
    switch (val) {
        case 'consult': return '在线图文问诊';
        case 'checkup': return '体检套餐预约';
        case 'chronic': return '慢病管理计划';
        case 'psychology': return '心理咨询预约';
        default: return '选择的服务';
    }
}

// 初始化：服务按钮 -> 预约表单联动
function initServiceButtons() {
    const cards = document.querySelectorAll('.service-card');
    const bookingSelect = document.querySelector('.booking-service-select');
    const bookingBox = document.querySelector('.quick-booking-form');

    if (!cards.length || !bookingSelect || !bookingBox) return;

    cards.forEach(card => {
        const btn = card.querySelector('.service-btn');
        const titleEl = card.querySelector('.service-title');
        if (!btn || !titleEl) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const mapped = mapServiceTitleToValue(titleEl.textContent.trim());
            if (mapped) {
                bookingSelect.value = mapped;
                // 记住选择
                sessionStorage.setItem('last_service_value', mapped);
            }

            // 高亮一下预约卡片
            bookingBox.classList.add('ringing');
            setTimeout(() => bookingBox.classList.remove('ringing'), 900);

            // 滚动到预约表单
            // 考虑吸顶导航高度，向上多偏移一些
            smoothScrollTo(bookingBox, -80);
        });
    });
}

// 初始化：FAQ 单开模式（可选）
function initFaqAccordion() {
    const details = document.querySelectorAll('.faq-item');
    if (!details.length) return;

    details.forEach(d => {
        d.addEventListener('toggle', () => {
            if (d.open) {
                details.forEach(other => {
                    if (other !== d) other.open = false;
                });
            }
        });
    });
}

// 初始化：快速预约表单
function initBookingForm() {
    const form = document.querySelector('.quick-booking-form');
    if (!form) return;

    const select = form.querySelector('.booking-service-select');
    const nameInput = form.querySelector('.booking-name-input');
    const phoneInput = form.querySelector('.booking-phone-input');
    const submitBtn = form.querySelector('.booking-submit-btn');

    // 恢复最近一次选择
    const last = sessionStorage.getItem('last_service_value');
    if (last && select) {
        select.value = last;
    }

    // 从 URL 参数初始化（优先级高于 sessionStorage）
    const serviceFromUrl = getQueryParam('service');
    if (serviceFromUrl && select) {
        select.value = serviceFromUrl;
        sessionStorage.setItem('last_service_value', serviceFromUrl);

        // 自动滚动到表单
        smoothScrollTo(form, -80);
        // 给个轻微高亮提示
        form.classList.add('ringing');
        setTimeout(() => form.classList.remove('ringing'), 900);
    }

    // 简单输入状态样式（可选）
    [nameInput, phoneInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            input.classList.toggle('has-value', !!input.value.trim());
        });
    });

    // 提交
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const service = select.value;
            const name = (nameInput.value || '').trim();
            const phone = (phoneInput.value || '').trim();

            // 校验
            if (!service) {
                alert('请选择服务类型');
                select.focus();
                return;
            }
            if (name.length < 2) {
                alert('请填写您的称呼（至少 2 个字符）');
                nameInput.focus();
                return;
            }
            if (!isValidPhone(phone)) {
                alert('请填写有效的联系电话（支持数字、空格和短横线）');
                phoneInput.focus();
                return;
            }

            // 模拟提交
            const payload = {
                service,
                name,
                phone,
                ts: Date.now()
            };
            console.log('提交预约意向（模拟）：', payload);

            // 记住服务选择
            sessionStorage.setItem('last_service_value', service);

            // 轻提示
            const label = mapValueToLabel(service);
            alert(`已收到您的预约意向：${label}\n我们会在 1 个工作日内与您联系确认。`);

            // 重置表单（服务类型保留）
            nameInput.value = '';
            phoneInput.value = '';
            nameInput.classList.remove('has-value');
            phoneInput.classList.remove('has-value');
        });
    }
}

// 可选：给 .quick-booking-form 添加一个轻微的“高亮”动画所需样式（JS 注入，避免额外 CSS 文件依赖）
function injectTempStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .quick-booking-form.ringing, .sidebar-block.ringing {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
            transition: box-shadow .25s ease;
        }
    `;
    document.head.appendChild(style);
}

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded', () => {
    injectTempStyles();
    initServiceButtons();
    initFaqAccordion();
    initBookingForm();
    console.log('services.js 已加载');
});
