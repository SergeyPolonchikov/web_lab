// Файл orderManager.js - обновленная версия

class OrderManager {
    constructor() {
        this.selectedDishes = {
            soup: null,
            salad: null,
            main: null,
            drink: null,
            dessert: null
        };
        
        this.isInitialized = false;
        
        // Ждем загрузки блюд перед инициализацией
        this.waitForDishesLoad();
    }
    
    async waitForDishesLoad() {
        try {
            // Проверяем, есть ли уже загруженные блюда
            if (typeof dishes !== 'undefined' && dishes && dishes.length > 0) {
                this.initialize();
                return;
            }
            
            // Если нет, ждем загрузки
            console.log('Ожидание загрузки блюд из API...');
            
            // Создаем промис для ожидания загрузки блюд
            await new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 30;
                const checkDishes = () => {
                    attempts++;
                    
                    if (typeof dishes !== 'undefined' && dishes && dishes.length > 0) {
                        console.log('Блюда загружены, инициализируем OrderManager');
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        console.warn('Таймаут ожидания загрузки блюд. Инициализация с пустым списком.');
                        resolve();
                    } else {
                        setTimeout(checkDishes, 100);
                    }
                };
                
                checkDishes();
            });
            
            this.initialize();
            
        } catch (error) {
            console.error('Ошибка при ожидании загрузки блюд:', error);
            this.initialize();
        }
    }
    
    initialize() {
        if (this.isInitialized) return;
        
        console.log('Инициализация OrderManager');
        this.setupEventListeners();
        this.updateOrderDisplay();
        this.updateSelectOptions();
        this.isInitialized = true;
        
        // Проверяем, есть ли сохраненные выборы в URL параметрах
        this.checkUrlSelections();
    }
    
    setupEventListeners() {
        // Обработчик клика на кнопки "Добавить" в карточках блюд
        document.addEventListener('click', (e) => {
            // Обработчик кнопки "Добавить" на карточках блюд
            if (e.target.classList.contains('add-button')) {
                const dishCard = e.target.closest('.dish-card');
                if (dishCard) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleDishSelection(dishCard);
                }
            }
            
            // Обработчик клика на саму карточку (для удобства)
            const dishCard = e.target.closest('.dish-card');
            if (dishCard && !e.target.classList.contains('add-button')) {
                const addButton = dishCard.querySelector('.add-button');
                if (addButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleDishSelection(dishCard);
                }
            }
            
            // Обработчик кнопок удаления в сводке заказа
            if (e.target.classList.contains('remove-dish-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const category = e.target.getAttribute('data-category');
                if (category) {
                    this.removeDish(category);
                }
            }
        });
        
        // Обработчики изменения select'ов в форме
        this.setupSelectListeners();
        
        // Обработчик кнопки сброса
        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) {
            // Удаляем старый обработчик и добавляем новый
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            
            newResetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetOrder();
            });
        }
    }
    
    setupSelectListeners() {
        const selects = [
            { id: 'soup', category: 'soup' },
            { id: 'salad', category: 'salad' },
            { id: 'main-course', category: 'main' },
            { id: 'drink', category: 'drink' },
            { id: 'dessert', category: 'dessert' }
        ];
        
        selects.forEach(({ id, category }) => {
            const select = document.getElementById(id);
            if (select) {
                // Удаляем старые обработчики, клонируя элемент
                const newSelect = select.cloneNode(true);
                select.parentNode.replaceChild(newSelect, select);
                
                // Добавляем новый обработчик
                newSelect.addEventListener('change', (e) => {
                    console.log(`Select ${id} changed to:`, e.target.value);
                    this.handleSelectChange(category, e.target.value);
                });
            }
        });
        
        console.log('Select listeners setup complete');
    }
    
    updateSelectOptions() {
        // Проверяем, что блюда загружены
        if (!dishes || dishes.length === 0) {
            console.warn('Не удалось обновить опции select: блюда не загружены');
            return;
        }
        
        const selects = [
            { id: 'soup', category: 'soup' },
            { id: 'salad', category: 'salad' },
            { id: 'main-course', category: 'main' },
            { id: 'drink', category: 'drink' },
            { id: 'dessert', category: 'dessert' }
        ];
        
        selects.forEach(({ id, category }) => {
            const select = document.getElementById(id);
            if (select) {
                // Сохраняем выбранное значение
                const currentValue = select.value;
                
                // Фильтруем блюда по категории
                const categoryDishes = dishes.filter(dish => {
                    if (category === 'main') {
                        return dish.category === 'main';
                    }
                    return dish.category === category;
                });
                
                // Сортируем по алфавиту
                const sortedDishes = categoryDishes.sort((a, b) => a.name.localeCompare(b.name));
                
                // Очищаем все опции кроме первой (пустой)
                while (select.options.length > 1) {
                    select.remove(1);
                }
                
                // Добавляем новые опции
                sortedDishes.forEach(dish => {
                    const option = document.createElement('option');
                    option.value = dish.keyword;
                    option.textContent = `${dish.name} - ${dish.price} руб.`;
                    select.appendChild(option);
                });
                
                // Восстанавливаем выбранное значение
                if (currentValue) {
                    select.value = currentValue;
                }
                
                // Если есть выбранное блюдо в менеджере, устанавливаем его
                if (this.selectedDishes[category]) {
                    select.value = this.selectedDishes[category].keyword;
                    console.log(`Setting ${id} to:`, this.selectedDishes[category].keyword);
                }
            }
        });
        
        console.log('Select options updated');
    }
    
    handleDishSelection(dishCard) {
        const dishKeyword = dishCard.getAttribute('data-dish');
        const dishCategory = dishCard.getAttribute('data-category');
        
        console.log('Выбрано блюдо из карточки:', dishKeyword, 'категория:', dishCategory);
        
        // Проверяем, что блюда загружены
        if (!dishes || dishes.length === 0) {
            console.warn('Блюда еще не загружены');
            return;
        }
        
        // Находим блюдо в загруженных данных
        const dish = dishes.find(d => d.keyword === dishKeyword);
        
        if (dish) {
            console.log('Найдено блюдо:', dish);
            this.selectedDishes[dish.category] = dish;
            this.updateOrderDisplay();
            this.syncSelects();
            this.highlightSelectedDishes();
            this.updateUrl();
            
            // Показываем уведомление о добавлении
            this.showAddNotification(dish);
        } else {
            console.error('Блюдо не найдено:', dishKeyword);
        }
    }
    
    handleSelectChange(category, dishKeyword) {
        console.log('Select change - category:', category, 'dishKeyword:', dishKeyword);
        
        if (dishKeyword) {
            // Находим блюдо в загруженных данных
            const dish = dishes.find(d => d.keyword === dishKeyword);
            if (dish) {
                console.log('Блюдо найдено из select:', dish);
                this.selectedDishes[category] = dish;
            } else {
                console.error('Блюдо не найдено в dishes для keyword:', dishKeyword);
                this.selectedDishes[category] = null;
            }
        } else {
            console.log('Select cleared for category:', category);
            this.selectedDishes[category] = null;
        }
        
        this.updateOrderDisplay();
        this.highlightSelectedDishes();
        this.updateUrl();
    }
    
    syncSelects() {
        const selects = [
            { id: 'soup', category: 'soup' },
            { id: 'salad', category: 'salad' },
            { id: 'main-course', category: 'main' },
            { id: 'drink', category: 'drink' },
            { id: 'dessert', category: 'dessert' }
        ];
        
        selects.forEach(({ id, category }) => {
            const select = document.getElementById(id);
            if (select && this.selectedDishes[category]) {
                console.log(`Syncing select ${id} to:`, this.selectedDishes[category].keyword);
                select.value = this.selectedDishes[category].keyword;
            } else if (select && !this.selectedDishes[category]) {
                console.log(`Clearing select ${id}`);
                select.value = '';
            }
        });
    }
    
    showAddNotification(dish) {
        // Создаем простое уведомление о добавлении
        const notification = document.createElement('div');
        notification.className = 'add-notification';
        notification.innerHTML = `
            <div class="add-notification-content">
                <span>✓ Добавлено: ${dish.name}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Показываем
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Убираем через 2 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
        
        // Добавляем стили для этого уведомления
        if (!document.querySelector('#add-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'add-notification-styles';
            style.textContent = `
                .add-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999;
                    transform: translateY(100px);
                    opacity: 0;
                    transition: transform 0.3s, opacity 0.3s;
                }
                .add-notification.show {
                    transform: translateY(0);
                    opacity: 1;
                }
                .add-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    updateOrderDisplay() {
        this.updateOrderSummary();
        this.updateTotalPrice();
    }
    
    updateOrderSummary() {
        const orderContainer = document.querySelector('.order-summary-fullwidth');
        if (!orderContainer) return;
        
        // Очищаем контейнер
        orderContainer.innerHTML = '';
        
        // Создаем контейнер для списка блюд
        const dishesList = document.createElement('div');
        dishesList.className = 'selected-dishes-list';
        
        // Добавляем заголовок
        const title = document.createElement('h4');
        title.textContent = 'Ваш текущий заказ:';
        orderContainer.appendChild(title);
        
        // Добавляем список блюд
        orderContainer.appendChild(dishesList);
        
        // Генерируем и добавляем HTML для блюд
        dishesList.innerHTML = this.generateOrderSummaryHTML();
    }
    
    generateOrderSummaryHTML() {
        const hasSelectedDishes = Object.values(this.selectedDishes).some(dish => dish !== null);
        
        if (!hasSelectedDishes) {
            return '<div class="empty-order-message">Выберите блюда из меню выше</div>';
        }
        
        let html = '';
        
        const categoryNames = {
            soup: 'Суп',
            salad: 'Салат',
            main: 'Главное блюдо',
            drink: 'Напиток',
            dessert: 'Десерт'
        };
        
        Object.entries(this.selectedDishes).forEach(([category, dish]) => {
            if (dish) {
                html += `
                    <div class="selected-dish-item" data-category="${category}">
                        <div class="dish-info">
                            <span class="dish-category">${categoryNames[category]}</span>
                            <span class="dish-name">${dish.name}</span>
                            <span class="dish-price">${dish.price} руб.</span>
                        </div>
                        <button class="remove-dish-btn" data-category="${category}" title="Удалить">✕</button>
                    </div>
                `;
            }
        });
        
        return html;
    }
    
    removeDish(category) {
        console.log('Removing dish from category:', category);
        this.selectedDishes[category] = null;
        
        // Сбрасываем соответствующий select
        const selectIds = {
            soup: 'soup',
            salad: 'salad',
            main: 'main-course',
            drink: 'drink',
            dessert: 'dessert'
        };
        
        const selectId = selectIds[category];
        if (selectId) {
            const select = document.getElementById(selectId);
            if (select) {
                select.value = '';
            }
        }
        
        this.updateOrderDisplay();
        this.highlightSelectedDishes();
        this.updateUrl();
    }
    
    updateTotalPrice() {
        const total = Object.values(this.selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        const orderContainer = document.querySelector('.order-summary-fullwidth');
        if (!orderContainer) return;
        
        let totalContainer = orderContainer.querySelector('.total-price-display');
        
        if (total > 0) {
            if (!totalContainer) {
                totalContainer = document.createElement('div');
                totalContainer.className = 'total-price-display';
                orderContainer.appendChild(totalContainer);
            }
            
            totalContainer.innerHTML = `<strong>Итого: ${total} руб.</strong>`;
            totalContainer.style.display = 'block';
        } else if (totalContainer) {
            totalContainer.style.display = 'none';
        }
    }
    
    highlightSelectedDishes() {
        // Убираем выделение со всех карточек
        document.querySelectorAll('.dish-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Выделяем выбранные блюда
        Object.values(this.selectedDishes).forEach(dish => {
            if (dish) {
                const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
                if (selectedCard) {
                    selectedCard.classList.add('selected');
                    
                    // Также меняем текст кнопки на выбранной карточке
                    const addButton = selectedCard.querySelector('.add-button');
                    if (addButton) {
                        addButton.textContent = '✓ Выбрано';
                        addButton.style.background = '#45a049';
                    }
                }
            }
        });
        
        // Для карточек, которые не выбраны, возвращаем обычный вид кнопки
        document.querySelectorAll('.dish-card:not(.selected)').forEach(card => {
            const addButton = card.querySelector('.add-button');
            if (addButton) {
                addButton.textContent = 'Добавить';
                addButton.style.background = '';
            }
        });
    }
    
    resetOrder() {
        this.selectedDishes = {
            soup: null,
            salad: null,
            main: null,
            drink: null,
            dessert: null
        };
        
        this.updateOrderDisplay();
        this.highlightSelectedDishes();
        this.clearUrl();
        
        // Сбрасываем select'ы
        const selects = [
            { id: 'soup', category: 'soup' },
            { id: 'salad', category: 'salad' },
            { id: 'main-course', category: 'main' },
            { id: 'drink', category: 'drink' },
            { id: 'dessert', category: 'dessert' }
        ];
        
        selects.forEach(({ id }) => {
            const select = document.getElementById(id);
            if (select) {
                select.value = '';
            }
        });
    }
    
    updateUrl() {
        const params = new URLSearchParams();
        
        Object.entries(this.selectedDishes).forEach(([category, dish]) => {
            if (dish) {
                params.set(category, dish.keyword);
            }
        });
        
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState(null, '', newUrl);
    }
    
    clearUrl() {
        window.history.replaceState(null, '', window.location.pathname);
    }
    
    checkUrlSelections() {
        const params = new URLSearchParams(window.location.search);
        
        if (!params.toString()) return;
        
        const selects = [
            { param: 'soup', category: 'soup', selectId: 'soup' },
            { param: 'salad', category: 'salad', selectId: 'salad' },
            { param: 'main', category: 'main', selectId: 'main-course' },
            { param: 'drink', category: 'drink', selectId: 'drink' },
            { param: 'dessert', category: 'dessert', selectId: 'dessert' }
        ];
        
        selects.forEach(({ param, category, selectId }) => {
            const dishKeyword = params.get(param);
            if (dishKeyword && dishes && dishes.length > 0) {
                const dish = dishes.find(d => d.keyword === dishKeyword);
                if (dish) {
                    this.selectedDishes[category] = dish;
                    
                    // Устанавливаем значение в select
                    const select = document.getElementById(selectId);
                    if (select) {
                        select.value = dishKeyword;
                    }
                }
            }
        });
        
        if (Object.values(this.selectedDishes).some(dish => dish !== null)) {
            this.updateOrderDisplay();
            this.highlightSelectedDishes();
        }
    }
    
    getSelectedDishes() {
        return { ...this.selectedDishes };
    }
    
    getOrderData() {
        return {
            ...this.selectedDishes,
            total: Object.values(this.selectedDishes)
                .filter(dish => dish !== null)
                .reduce((sum, dish) => sum + dish.price, 0)
        };
    }
}

// Глобальная переменная для доступа из других файлов
let orderManager;

// Инициализация после загрузки DOM и блюд
async function initializeOrderManager() {
    try {
        console.log('Начало инициализации OrderManager...');
        
        // Проверяем, что блюда загружены
        if (typeof dishes === 'undefined' || !dishes || dishes.length === 0) {
            console.log('Блюда еще не загружены, ждем...');
            
            // Ждем пока displayDishes.js загрузит блюда
            await new Promise((resolve) => {
                let attempts = 0;
                const maxAttempts = 50;
                
                const checkInterval = setInterval(() => {
                    attempts++;
                    
                    if (typeof dishes !== 'undefined' && dishes && dishes.length > 0) {
                        clearInterval(checkInterval);
                        console.log('Блюда загружены, создаем OrderManager');
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        console.warn('Таймаут ожидания блюд. Продолжаем без них.');
                        resolve();
                    }
                }, 100);
            });
        }
        
        // Создаем экземпляр OrderManager
        orderManager = new OrderManager();
        
        console.log('OrderManager успешно инициализирован');
        
    } catch (error) {
        console.error('Ошибка при инициализации OrderManager:', error);
        orderManager = new OrderManager();
    }
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаем инициализацию OrderManager');
    initializeOrderManager();
});
