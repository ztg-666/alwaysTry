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
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.startAutoPlay();
        
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
        this.stopAutoPlay(); 
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ==================== 卡片动画效果 ====================


function initCardAnimations() {
    const cards = document.querySelectorAll(
        '.link-card, .article-card, .community-card'
    );
    // IntersectionObserver（交叉观察器）
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            el.classList.add('show');

            obs.unobserve(el);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        card.classList.add('card-animate');
        observer.observe(card);
    });
}

// ==================== 快捷入口交互 ====================


function initQuickLinksInteraction() {
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
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
