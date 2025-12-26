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
        this.setupGlobalEventListeners();
        this.waitForDishesLoad();
    }
    
    setupGlobalEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-dish-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const category = e.target.getAttribute('data-category');
                if (category) {
                    this.removeDish(category);
                }
            }
        });
    }
    
    async waitForDishesLoad() {
        try {
            if (typeof dishes !== 'undefined' && dishes && dishes.length > 0) {
                this.initialize();
                return;
            }
            
            console.log('Ожидание загрузки блюд из API...');
            
            await new Promise((resolve) => {
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
        
        this.checkUrlSelections();
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-button')) {
                const dishCard = e.target.closest('.dish-card');
                if (dishCard) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleDishSelection(dishCard);
                }
            }
            
            const dishCard = e.target.closest('.dish-card');
            if (dishCard && !e.target.classList.contains('add-button')) {
                const addButton = dishCard.querySelector('.add-button');
                if (addButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleDishSelection(dishCard);
                }
            }
             const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');
            // Вызываем валидацию
            if (window.orderValidator) {
                window.orderValidator.handleSubmitClick(e);
            }
        });
    }
        });
        
        this.setupSelectListeners();
        
        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) {
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
                const newSelect = select.cloneNode(true);
                select.parentNode.replaceChild(newSelect, select);
                
                newSelect.addEventListener('change', (e) => {
                    console.log(`Select ${id} changed to:`, e.target.value);
                    this.handleSelectChange(category, e.target.value);
                });
            }
        });
    }
    
    updateSelectOptions() {
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
                const currentValue = select.value;
                
                const categoryDishes = dishes.filter(dish => {
                    if (category === 'main') {
                        return dish.category === 'main';
                    }
                    return dish.category === category;
                });
                
                const sortedDishes = categoryDishes.sort((a, b) => a.name.localeCompare(b.name));
                
                while (select.options.length > 1) {
                    select.remove(1);
                }
                
                sortedDishes.forEach(dish => {
                    const option = document.createElement('option');
                    option.value = dish.keyword;
                    option.textContent = `${dish.name} - ${dish.price} руб.`;
                    select.appendChild(option);
                });
                
                if (currentValue) {
                    select.value = currentValue;
                }
                
                if (this.selectedDishes[category]) {
                    select.value = this.selectedDishes[category].keyword;
                }
            }
        });
    }
    
    handleDishSelection(dishCard) {
        const dishKeyword = dishCard.getAttribute('data-dish');
        const dishCategory = dishCard.getAttribute('data-category');
        
        console.log('Выбрано блюдо из карточки:', dishKeyword, 'категория:', dishCategory);
        
        if (!dishes || dishes.length === 0) {
            console.warn('Блюда еще не загружены');
            return;
        }
        
        const dish = dishes.find(d => d.keyword === dishKeyword);
        
        if (dish) {
            this.selectedDishes[dish.category] = dish;
            this.updateOrderDisplay();
            this.syncSelects();
            this.highlightSelectedDishes();
            this.updateUrl();
            this.showAddNotification(dish);
        }
    }
    
    handleSelectChange(category, dishKeyword) {
        console.log('Select change - category:', category, 'dishKeyword:', dishKeyword);
        
        if (dishKeyword) {
            const dish = dishes.find(d => d.keyword === dishKeyword);
            if (dish) {
                this.selectedDishes[category] = dish;
            } else {
                this.selectedDishes[category] = null;
            }
        } else {
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
                select.value = this.selectedDishes[category].keyword;
            } else if (select && !this.selectedDishes[category]) {
                select.value = '';
            }
        });
    }
    
    updateOrderDisplay() {
        const summaryContainer = document.querySelector('.order-summary-fullwidth');
        if (!summaryContainer) return;
        
        const selectedDishes = this.selectedDishes;
        const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
        
        if (!hasSelectedDishes) {
            summaryContainer.innerHTML = '<div class="empty-order-message">Выберите блюда из меню выше</div>';
            return;
        }
        
        const categoryNames = {
            soup: 'Суп',
            salad: 'Салат',
            main: 'Главное блюдо',
            drink: 'Напиток',
            dessert: 'Десерт'
        };
        
        let html = '<h4>Ваш заказ:</h4>';
        html += '<div class="selected-dishes-list">';
        
        let total = 0;
        
        Object.entries(selectedDishes).forEach(([category, dish]) => {
            if (dish) {
                total += dish.price;
                html += `
                    <div class="selected-dish-item">
                        <div class="dish-info">
                            <span class="dish-category">${categoryNames[category]}:</span>
                            <span class="dish-name">${dish.name}</span>
                            <span class="dish-price">${dish.price} руб.</span>
                        </div>
                        <button class="remove-dish-btn" data-category="${category}">×</button>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        html += `<div class="total-price-display">Итого: ${total} руб.</div>`;
        
        summaryContainer.innerHTML = html;
    }
    
    removeDish(category) {
        console.log('Removing dish from category:', category);
        
        if (this.selectedDishes[category]) {
            this.selectedDishes[category] = null;
            
            this.updateOrderDisplay();
            this.syncSelects();
            this.highlightSelectedDishes();
            this.updateUrl();
            
            this.showRemoveNotification(category);
        }
    }
    
    showAddNotification(dish) {
        const notification = document.createElement('div');
        notification.className = 'add-notification';
        notification.innerHTML = `
            <div class="add-notification-content">
                <span>✓ Добавлено: ${dish.name}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    showRemoveNotification(category) {
        const categoryNames = {
            soup: 'суп',
            salad: 'салат',
            main: 'главное блюдо',
            drink: 'напиток',
            dessert: 'десерт'
        };
        
        const notification = document.createElement('div');
        notification.className = 'add-notification';
        notification.innerHTML = `
            <div class="add-notification-content">
                <span>🗑️ Удалено: ${categoryNames[category]}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    highlightSelectedDishes() {
        // Убираем выделение со всех карточек
        document.querySelectorAll('.dish-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Выделяем выбранные блюда
        Object.values(this.selectedDishes).forEach(dish => {
            if (dish) {
                const dishCard = document.querySelector(`.dish-card[data-dish="${dish.keyword}"]`);
                if (dishCard) {
                    dishCard.classList.add('selected');
                }
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
        
        const url = new URL(window.location);
        url.search = params.toString();
        window.history.replaceState({}, '', url);
    }
    
    checkUrlSelections() {
        const params = new URLSearchParams(window.location.search);
        
        Object.keys(this.selectedDishes).forEach(category => {
            const dishKeyword = params.get(category);
            if (dishKeyword) {
                const dish = dishes.find(d => d.keyword === dishKeyword);
                if (dish) {
                    this.selectedDishes[category] = dish;
                }
            }
        });
        
        if (Object.values(this.selectedDishes).some(dish => dish !== null)) {
            this.updateOrderDisplay();
            this.syncSelects();
            this.highlightSelectedDishes();
        }
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
        this.syncSelects();
        this.highlightSelectedDishes();
        this.updateUrl();
        
        const notification = document.createElement('div');
        notification.className = 'add-notification';
        notification.innerHTML = `
            <div class="add-notification-content">
                <span>🔄 Заказ сброшен</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    getSelectedDishes() {
        return this.selectedDishes;
    }
}

let orderManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing OrderManager');
    
    orderManager = new OrderManager();
    window.orderManager = orderManager;
});

