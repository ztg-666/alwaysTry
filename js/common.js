// ==================== 通用工具函数 ====================

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 延迟时间(毫秒)
 */
function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} delay - 延迟时间(毫秒)
 */
function throttle(func, delay) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            func.apply(this, args);
            lastTime = now;
        }
    };
}

// ==================== 导航栏功能 ====================

/**
 * 导航栏高亮当前页面
 */
function highlightCurrentNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 搜索功能
 */
function initSearch() {
    const searchForm = document.querySelector('.nav-search');
    const searchInput = searchForm?.querySelector('input');
    const searchButton = searchForm?.querySelector('button');
    
    if (!searchForm || !searchInput || !searchButton) return;
    
    // 搜索按钮点击事件
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch(searchInput.value.trim());
    });
    
    // 回车键搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value.trim());
        }
    });
}

/**
 * 执行搜索
 * @param {string} keyword - 搜索关键词
 */
function performSearch(keyword) {
    if (!keyword) {
        alert('请输入搜索关键词');
        return;
    }
    
    // 这里可以跳转到搜索结果页面
    console.log('搜索关键词:', keyword);
    // window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
    
    // 临时提示
    alert(`搜索功能开发中...\n您搜索的关键词是: ${keyword}`);
}

// ==================== 页面滚动效果 ====================

/**
 * 监听页面滚动,为导航栏添加阴影效果
 */
function initScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
        } else {
            navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
}

/**
 * 平滑滚动到顶部
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ==================== 返回顶部按钮 ====================

/**
 * 创建并初始化返回顶部按钮
 */
function initBackToTop() {
    // 创建按钮元素
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', '返回顶部');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 50px;
        height: 50px;
        background-color: #87E8DE;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s, background-color 0.3s;
        z-index: 999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 滚动显示/隐藏按钮
    const toggleButton = throttle(() => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleButton);
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // 鼠标悬停效果
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.backgroundColor = '#6CCBC0';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.backgroundColor = '#87E8DE';
    });
}

// ==================== 页面加载完成后初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    highlightCurrentNav();
    initSearch();
    initScrollEffect();
    initBackToTop();
    
    console.log('通用脚本已加载');
});
