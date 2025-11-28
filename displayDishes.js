// Функция для отображения блюд на странице
function displayDishes() {
    // Сортируем блюда по названию в алфавитном порядке
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        salad: sortedDishes.filter(dish => dish.category === 'salad'),
        main: sortedDishes.filter(dish => dish.category === 'main'),
        drink: sortedDishes.filter(dish => dish.category === 'drink'),
        dessert: sortedDishes.filter(dish => dish.category === 'dessert')
    };
    
    // Отображаем блюда для каждой категории
    displayCategory('soup', 'Супы', dishesByCategory.soup);
    displayCategory('salad', 'Салаты и стартеры', dishesByCategory.salad);
    displayCategory('main', 'Главные блюда', dishesByCategory.main);
    displayCategory('drink', 'Напитки', dishesByCategory.drink);
    displayCategory('dessert', 'Десерты', dishesByCategory.dessert);
    
    // Создаем фильтры для каждой категории
    createFilters();
}

// Функция для отображения блюд конкретной категории
function displayCategory(category, categoryName, dishes, filterKind = null) {
    let section = document.querySelector(`.menu-section[data-category="${category}"]`);
    
    if (!section) {
        // Создаем секцию если её нет
        section = createCategorySection(category, categoryName);
    }
    
    // Очищаем существующую сетку
    const grid = section.querySelector('.dishes-grid');
    grid.innerHTML = '';
    
    // Фильтруем блюда если указан фильтр
    const filteredDishes = filterKind ? 
        dishes.filter(dish => dish.kind === filterKind) : 
        dishes;
    
    // Создаем карточки для каждого блюда
    filteredDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
}

// Функция для создания секции категории
function createCategorySection(category, categoryName) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.className = 'menu-section';
    section.setAttribute('data-category', category);
    
    section.innerHTML = `
        <h2>${categoryName}</h2>
        <div class="filters" data-category="${category}">
            <!-- Фильтры будут добавлены динамически -->
        </div>
        <div class="dishes-grid">
            <!-- Блюда будут добавлены через JavaScript -->
        </div>
    `;
    
    main.appendChild(section);
    return section;
}

// Функция для создания карточки блюда
function createDishCard(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    
    dishCard.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" class="dish-image">
        <div class="dish-info">
            <p class="price">${dish.price} руб.</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="add-button">Добавить</button>
        </div>
    `;
    
    return dishCard;
}

// Функция для создания фильтров
function createFilters() {
    const filterConfig = {
        soup: [
            { name: 'рыбный', kind: 'fish' },
            { name: 'мясной', kind: 'meat' },
            { name: 'вегетарианский', kind: 'veg' }
        ],
        salad: [
            { name: 'рыбный', kind: 'fish' },
            { name: 'мясной', kind: 'meat' },
            { name: 'вегетарианский', kind: 'veg' }
        ],
        main: [
            { name: 'рыбное', kind: 'fish' },
            { name: 'мясное', kind: 'meat' },
            { name: 'вегетарианское', kind: 'veg' }
        ],
        drink: [
            { name: 'холодный', kind: 'cold' },
            { name: 'горячий', kind: 'hot' }
        ],
        dessert: [
            { name: 'маленькая порция', kind: 'small' },
            { name: 'средняя порция', kind: 'medium' },
            { name: 'большая порция', kind: 'large' }
        ]
    };
    
    Object.keys(filterConfig).forEach(category => {
        const filtersContainer = document.querySelector(`.filters[data-category="${category}"]`);
        if (filtersContainer) {
            filtersContainer.innerHTML = '';
            
            filterConfig[category].forEach(filter => {
                const filterButton = document.createElement('button');
                filterButton.className = 'filter-btn';
                filterButton.setAttribute('data-kind', filter.kind);
                filterButton.textContent = filter.name;
                filtersContainer.appendChild(filterButton);
            });
        }
    });
}

// Функция для фильтрации блюд
function filterDishes(category, kind) {
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    const categoryDishes = sortedDishes.filter(dish => dish.category === category);
    
    // Получаем текущий активный фильтр
    const filtersContainer = document.querySelector(`.filters[data-category="${category}"]`);
    const activeFilter = filtersContainer.querySelector('.filter-btn.active');
    
    let filterToApply = null;
    
    if (activeFilter && activeFilter.getAttribute('data-kind') === kind) {
        // Если кликнули на активный фильтр - снимаем фильтр
        activeFilter.classList.remove('active');
        filterToApply = null;
    } else {
        // Убираем активный класс со всех фильтров
        filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс к выбранному фильтру
        const selectedFilter = filtersContainer.querySelector(`[data-kind="${kind}"]`);
        if (selectedFilter) {
            selectedFilter.classList.add('active');
            filterToApply = kind;
        }
    }
    
    // Отображаем отфильтрованные блюда
    const categoryName = getCategoryName(category);
    displayCategory(category, categoryName, categoryDishes, filterToApply);
}

// Функция для получения названия категории
function getCategoryName(category) {
    const names = {
        soup: 'Супы',
        salad: 'Салаты и стартеры',
        main: 'Главные блюда',
        drink: 'Напитки',
        dessert: 'Десерты'
    };
    return names[category];
}

// Обработчик кликов на фильтры
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        const category = e.target.closest('.filters').getAttribute('data-category');
        const kind = e.target.getAttribute('data-kind');
        filterDishes(category, kind);
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', displayDishes);
