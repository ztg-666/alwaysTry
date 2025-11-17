// ==================== 健康知识页脚本 ====================

/**
 * 从 meta 文本中解析日期
 * 例如："2024-11-08 | 饮食营养 | 阅读 980"
 * 返回 Date 对象，解析失败则返回 null
 */
function parseDateFromMeta(metaText) {
    if (!metaText) return null;
    // 取第一个“|”前的部分
    const datePart = metaText.split('|')[0].trim(); // "2024-11-08"
    const date = new Date(datePart);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * 从 meta 文本中解析阅读数
 * 例如："2024-11-08 | 饮食营养 | 阅读 1,256"
 * 返回 Number，解析失败则返回 0
 */
function parseReadCountFromMeta(metaText) {
    if (!metaText) return 0;

    // 找到包含“阅读”的部分
    const parts = metaText.split('|').map(p => p.trim());
    const readPart = parts.find(p => p.includes('阅读'));
    if (!readPart) return 0;

    // 提取数字，去掉逗号
    const match = readPart.replace(/,/g, '').match(/(\d+)/);
    return match ? Number(match[1]) : 0;
}

/**
 * 初始化分类筛选
 */
function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.knowledge-item');

    if (!filterBtns.length || !items.length) return;

    // 根据 URL 参数设置默认分类，如 ?category=diet
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category') || 'all';

    function applyFilter(category) {
        items.forEach(item => {
            const itemCategory = item.dataset.category || 'all';
            if (category === 'all' || category === itemCategory) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 设置按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category || 'all';

            // 激活样式
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 应用筛选
            applyFilter(category);

            // 更新 URL（不刷新页面）
            const url = new URL(window.location.href);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.replaceState({}, '', url.toString());
        });
    });

    // 初始化时根据 URL 或默认值应用一次
    const initialBtn = Array.from(filterBtns).find(
        btn => (btn.dataset.category || 'all') === initialCategory
    );
    if (initialBtn) {
        filterBtns.forEach(b => b.classList.remove('active'));
        initialBtn.classList.add('active');
        applyFilter(initialCategory);
    } else {
        applyFilter('all');
    }
}

/**
 * 初始化排序功能
 */
function initSort() {
    const sortBtns = document.querySelectorAll('.sort-btn');
    const list = document.querySelector('.knowledge-list');

    if (!sortBtns.length || !list) return;

    // 所有文章项（不包含分页）
    const allItems = Array.from(list.querySelectorAll('.knowledge-item'));
    const pagination = list.querySelector('.knowledge-pagination');

    // 预先为每条数据解析并存储日期和阅读数，避免重复解析
    const itemData = allItems.map((item, index) => {
        const metaEl = item.querySelector('.knowledge-meta');
        const metaText = metaEl ? metaEl.textContent.trim() : '';

        return {
            element: item,
            index, // 原始顺序
            date: parseDateFromMeta(metaText),
            reads: parseReadCountFromMeta(metaText)
        };
    });

    function renderList(sortedArray) {
        // 先把文章项插回去
        sortedArray.forEach(obj => {
            list.insertBefore(obj.element, pagination || null);
        });

        // 确保分页始终在最后
        if (pagination) {
            list.appendChild(pagination);
        }
    }

    function sortByNewest() {
        const sorted = [...itemData].sort((a, b) => {
            const timeA = a.date ? a.date.getTime() : 0;
            const timeB = b.date ? b.date.getTime() : 0;
            // 日期新的在前
            return timeB - timeA;
        });
        renderList(sorted);
    }

    function sortByHot() {
        const sorted = [...itemData].sort((a, b) => {
            // 阅读数多的在前
            return b.reads - a.reads;
        });
        renderList(sorted);
    }

    // 设置按钮事件
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sortType = btn.dataset.sort;

            // 激活样式
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (sortType === 'hot') {
                sortByHot();
            } else {
                // 默认按最新排序
                sortByNewest();
            }
        });
    });

    // 默认按“最新发布”排序一次
    sortByNewest();
}

/**
 * （可选）初始化本页专用的小交互
 * 例如：点击文章标题也跳转到“阅读全文”链接
 */
function initTitleClick() {
    const items = document.querySelectorAll('.knowledge-item');
    if (!items.length) return;

    items.forEach(item => {
        const titleEl = item.querySelector('.knowledge-title');
        const linkEl = item.querySelector('.read-more');
        if (titleEl && linkEl) {
            titleEl.style.cursor = 'pointer';
            titleEl.addEventListener('click', () => {
                window.location.href = linkEl.getAttribute('href');
            });
        }
    });
}

// ==================== 页面加载完成后初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    // 依赖于页面结构的初始化
    initCategoryFilter();
    initSort();
    initTitleClick();

    console.log('知识页面脚本已加载');
});
