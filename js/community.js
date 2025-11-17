// ==================== 工具函数 ====================

/**
 * 将时间字符串解析为 Date 对象
 * 例如："2024-11-15 20:18"
 */
function parseDateTime(text) {
    if (!text) return null;
    // 简单按空格拆分
    const [datePart, timePart] = text.trim().split(' ');
    if (!datePart) return null;

    // 2024-11-15
    const [y, m, d] = datePart.split('-').map(Number);
    let h = 0, mi = 0;
    if (timePart) {
        const [hh, mm] = timePart.split(':').map(Number);
        h = hh || 0;
        mi = mm || 0;
    }

    const dt = new Date(y, (m || 1) - 1, d || 1, h, mi);
    return isNaN(dt.getTime()) ? null : dt;
}

/**
 * 读取节点上的数字属性
 */
function getNumberAttr(el, attrName, defaultValue = 0) {
    const v = el.getAttribute(attrName);
    if (v == null) return defaultValue;
    const n = Number(v);
    return isNaN(n) ? defaultValue : n;
}

// ==================== 分类筛选 ====================

function initCommunityCategoryFilter() {
    const filterBtns = document.querySelectorAll('.community-filter-btn');
    const items = document.querySelectorAll('.community-item');

    if (!filterBtns.length || !items.length) return;

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

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category || 'all';

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilter(category);

            // 更新 URL 参数但不刷新页面
            const url = new URL(window.location.href);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.replaceState({}, '', url.toString());
        });
    });

    const initialBtn = Array.from(filterBtns).find(
        b => (b.dataset.category || 'all') === initialCategory
    );
    if (initialBtn) {
        filterBtns.forEach(b => b.classList.remove('active'));
        initialBtn.classList.add('active');
        applyFilter(initialCategory);
    } else {
        applyFilter('all');
    }
}

// ==================== 排序功能 ====================

function initCommunitySort() {
    const sortBtns = document.querySelectorAll('.community-sort-btn');
    const list = document.querySelector('.community-list');
    if (!sortBtns.length || !list) return;

    const allItems = Array.from(list.querySelectorAll('.community-item'));
    const pagination = list.querySelector('.community-pagination');

    // 预解析每条帖子的数据
    const itemData = allItems.map((item, index) => {
        const timeEl = item.querySelector('.meta-time');
        const timeText = timeEl ? timeEl.textContent.trim() : '';
        const date = parseDateTime(timeText);

        const replies = getNumberAttr(item, 'data-replies', 0);
        const likes = getNumberAttr(item, 'data-likes', 0);

        return {
            element: item,
            index,   // 原始顺序备用
            date,
            replies,
            likes
        };
    });

    function renderList(sortedArray) {
        sortedArray.forEach(obj => {
            list.insertBefore(obj.element, pagination || null);
        });
        if (pagination) {
            list.appendChild(pagination);
        }
    }

    function sortByLatest() {
        const sorted = [...itemData].sort((a, b) => {
            const tA = a.date ? a.date.getTime() : 0;
            const tB = b.date ? b.date.getTime() : 0;
            return tB - tA; // 新的在前
        });
        renderList(sorted);
    }

    function sortByHot() {
        const sorted = [...itemData].sort((a, b) => {
            // 简单权重：点赞*2 + 回复
            const scoreA = a.likes * 2 + a.replies;
            const scoreB = b.likes * 2 + b.replies;
            return scoreB - scoreA;
        });
        renderList(sorted);
    }

    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sortType = btn.dataset.sort;

            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (sortType === 'hot') {
                sortByHot();
            } else {
                sortByLatest();
            }
        });
    });

    // 默认按“最新”排序
    sortByLatest();
}

// ==================== 发帖功能（前端模拟） ====================

function initCreatePost() {
    const titleInput = document.querySelector('.post-title-input');
    const contentInput = document.querySelector('.post-content-input');
    const categorySelect = document.querySelector('.post-category-select');
    const submitBtn = document.querySelector('.post-submit-btn');
    const list = document.querySelector('.community-list');

    if (!titleInput || !contentInput || !categorySelect || !submitBtn || !list) return;

    function validate() {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const category = categorySelect.value;

        if (title.length < 5) {
            alert('标题至少需要 5 个字哦～');
            titleInput.focus();
            return false;
        }
        if (content.length < 20) {
            alert('内容建议不少于 20 个字，这样更容易获得高质量回复。');
            contentInput.focus();
            return false;
        }
        if (!category) {
            alert('请选择话题分类。');
            categorySelect.focus();
            return false;
        }

        return { title, content, category };
    }

    submitBtn.addEventListener('click', () => {
        const result = validate();
        if (!result) return;

        const { title, content, category } = result;

        // 模拟当前时间
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mi = String(now.getMinutes()).padStart(2, '0');
        const timeText = `${y}-${m}-${d} ${hh}:${mi}`;

        // 根据分类生成标签文字和样式
        const categoryMap = {
            disease: { text: '疾病管理', tagClass: 'tag-disease' },
            diet:    { text: '饮食营养', tagClass: 'tag-diet' },
            sport:   { text: '运动健身', tagClass: 'tag-sport' },
            mental:  { text: '心理健康', tagClass: 'tag-mental' },
            life:    { text: '生活习惯', tagClass: 'tag-life' }
        };
        const catInfo = categoryMap[category] || { text: '其它', tagClass: 'tag-life' };

        // 创建一个新的帖子元素（简单示例）
        const newItem = document.createElement('article');
        newItem.className = 'community-item';
        newItem.setAttribute('data-category', category);
        newItem.setAttribute('data-replies', '0');
        newItem.setAttribute('data-likes', '0');

        newItem.innerHTML = `
            <div class="community-item-header">
                <div class="user-info">
                    <img src="images/user-default.jpg" alt="用户头像">
                    <div class="user-meta">
                        <span class="user-name">匿名用户</span>
                        <span class="user-tag">新发表 · 等待回复</span>
                    </div>
                </div>
                <span class="post-tag ${catInfo.tagClass}">${catInfo.text}</span>
            </div>
            <h3 class="community-title">${title.replace(/</g, '&lt;')}</h3>
            <p class="community-excerpt">
                ${content.replace(/</g, '&lt;')}
            </p>
            <div class="community-meta">
                <span class="meta-time">${timeText}</span>
                <span class="meta-count">💬 0 回复</span>
                <span class="meta-count">👍 0</span>
            </div>
        `;

        // 插入到列表最前面（分页前）
        const firstItem = list.querySelector('.community-item');
        const pagination = list.querySelector('.community-pagination');
        if (firstItem) {
            list.insertBefore(newItem, firstItem);
        } else if (pagination) {
            list.insertBefore(newItem, pagination);
        } else {
            list.appendChild(newItem);
        }

        // 清空表单
        titleInput.value = '';
        contentInput.value = '';
        categorySelect.value = '';

        alert('话题已发布（前端模拟），实际项目中可在此处调用后端接口。');
    });
}

// ==================== 小交互：标题点击 ====================

function initCommunityTitleClick() {
    const items = document.querySelectorAll('.community-item');
    if (!items.length) return;

    items.forEach(item => {
        const titleEl = item.querySelector('.community-title');
        if (!titleEl) return;

        titleEl.style.cursor = 'pointer';

    });
}

// ==================== 页面加载后初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    initCommunityCategoryFilter();
    initCommunitySort();
    initCreatePost();
    initCommunityTitleClick();

    console.log('社区页面脚本已加载');
});
