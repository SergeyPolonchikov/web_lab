// Функция для отображения блюд на странице
function displayDishes() {
    // Сортируем блюда по названию в алфавитном порядке
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        salad: sortedDishes.filter(dish => dish.category === 'salad'),
        main: sortedDishes.filter(dish => dish.category === 'main'),
        drink: sortedDishes.filter(dish => dish.category === 'drink')
    };
    
    // Отображаем блюда для каждой категории
    displayCategory('soup', 'Супы', dishesByCategory.soup);
    displayCategory('salad', 'Салаты', dishesByCategory.salad);
    displayCategory('main', 'Главные блюда', dishesByCategory.main);
    displayCategory('drink', 'Напитки', dishesByCategory.drink);
}

// Функция для отображения блюд конкретной категории
function displayCategory(category, categoryName, dishes) {
    const section = document.querySelector(`.menu-section:nth-child(${getSectionIndex(category)})`);
    
    if (!section) return;
    
    // Очищаем существующую сетку
    const grid = section.querySelector('.dishes-grid');
    grid.innerHTML = '';
    
    // Создаем карточки для каждого блюда
    dishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
}

// Функция для определения индекса секции
function getSectionIndex(category) {
    const categoryOrder = ['soup', 'salad', 'main', 'drink'];
    return categoryOrder.indexOf(category) + 1;
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', displayDishes);