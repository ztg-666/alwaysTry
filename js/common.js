// 工具

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

// 导航栏
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

function performSearch(keyword) {
    if (!keyword) {
        alert('请输入搜索关键词');
        return;
    }

    alert(`搜索功能开发中...\n您搜索的关键词是: ${keyword}`);
}

// 返回顶部

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initBackToTop() {
    // 创建按钮元素
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
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


document.addEventListener('DOMContentLoaded', () => {
    highlightCurrentNav();
    initSearch();
    initBackToTop();
});
