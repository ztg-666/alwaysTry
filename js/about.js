
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 1. 滚动显示动画 ==========
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 监听需要动画的元素
    const animatedElements = document.querySelectorAll(`
        .intro-section,
        .mission-card,
        .timeline-item,
        .advantage-card,
        .team-card,
        .honor-item,
        .contact-cta
    `);

    animatedElements.forEach(el => {
        fadeInObserver.observe(el);
    });

    // ========== 2. 时间轴项目交错动画 ==========
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });

    // ========== 3. 数字滚动动画（如果有数据统计） ==========
    function animateNumber(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // 示例：如果页面有数据统计区域
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateNumber(entry.target, target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => statObserver.observe(stat));
    }

    // ========== 4. 团队卡片翻转效果（可选增强） ==========
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });

    // ========== 5. 平滑滚动到锚点 ==========
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========== 6. 荣誉徽章悬停光效 ==========
    const honorItems = document.querySelectorAll('.honor-item');
    honorItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                rgba(255, 255, 255, 0.35) 0%, 
                rgba(255, 255, 255, 0.15) 50%)
            `;
        });

        item.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.15)';
        });
    });

    // ========== 7. 页面加载进度提示 ==========
    window.addEventListener('load', function() {
        document.body.classList.add('page-loaded');
        
        // 延迟显示头部动画
        setTimeout(() => {
            const pageHeader = document.querySelector('.page-header');
            if (pageHeader) {
                pageHeader.style.opacity = '0';
                pageHeader.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    pageHeader.style.transition = 'all 0.8s ease';
                    pageHeader.style.opacity = '1';
                    pageHeader.style.transform = 'translateY(0)';
                }, 100);
            }
        }, 200);
    });

    // ========== 8. 时间轴进度指示器 ==========
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const progressLine = document.createElement('div');
        progressLine.className = 'timeline-progress';
        progressLine.style.cssText = `
            position: absolute;
            left: 50%;
            top: 0;
            width: 4px;
            height: 0;
            background: linear-gradient(180deg, #ffd700 0%, #ff6b6b 100%);
            transform: translateX(-50%);
            transition: height 0.3s ease;
            z-index: 1;
        `;
        timeline.appendChild(progressLine);

        window.addEventListener('scroll', () => {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
                const visibleHeight = Math.min(
                    windowHeight - timelineRect.top,
                    timelineRect.height
                );
                const progress = (visibleHeight / timelineRect.height) * 100;
                progressLine.style.height = `${progress}%`;
            }
        });
    }


});

