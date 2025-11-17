// ==================== 轮播图功能 ====================

class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.slider-btn.prev');
        this.nextBtn = document.querySelector('.slider-btn.next');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5秒自动切换
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // 绑定按钮事件
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // 绑定指示点事件
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // 开始自动播放
        this.startAutoPlay();
        
        // 鼠标悬停时暂停自动播放
        const sliderContainer = document.querySelector('.hero-slider');
        sliderContainer?.addEventListener('mouseenter', () => this.stopAutoPlay());
        sliderContainer?.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        // 移除当前激活状态
        this.slides[this.currentSlide]?.classList.remove('active');
        this.dots[this.currentSlide]?.classList.remove('active');
        
        // 设置新的激活状态
        this.currentSlide = index;
        this.slides[this.currentSlide]?.classList.add('active');
        this.dots[this.currentSlide]?.classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // 先清除已有的定时器
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    initTouchEvents() {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
}

// ==================== 卡片动画效果 ====================


function initCardAnimations() {
    const cards = document.querySelectorAll('.link-card, .article-card, .community-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => observer.observe(card));
}

// ==================== 快捷入口交互 ====================


function initQuickLinksInteraction() {
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 添加点击波纹效果
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background-color: rgba(135, 232, 222, 0.5);
                width: 100px;
                height: 100px;
                margin-top: -50px;
                margin-left: -50px;
                animation: ripple 0.6s;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // 添加动画关键帧
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                from {
                    opacity: 1;
                    transform: scale(0);
                }
                to {
                    opacity: 0;
                    transform: scale(4);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== 文章卡片交互 ====================


function initArticleCardInteraction() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const readMore = card.querySelector('.read-more');
        
        card.addEventListener('mouseenter', function() {
            if (readMore) {
                readMore.style.transform = 'translateX(5px)';
                readMore.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (readMore) {
                readMore.style.transform = 'translateX(0)';
            }
        });
    });
}

// ==================== 社区卡片交互 ====================

function initCommunityCardInteraction() {
    const communityCards = document.querySelectorAll('.community-card');
    
    communityCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            this.style.transform = this.style.transform === 'scale(1.02)' ? 'scale(1)' : 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // 初始化轮播图
    const slider = new HeroSlider();
    
    // 初始化各种交互效果
    initCardAnimations();
    initQuickLinksInteraction();
    initArticleCardInteraction();
    initCommunityCardInteraction();
    
    console.log('首页脚本已加载');
});
