class OrderManager {
    constructor() {
        this.selectedDishes = {
            soup: null,
            salad: null,
            main: null,
            drink: null,
            dessert: null
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateOrderDisplay();
    }
    
    setupEventListeners() {
        // Обработчик клика на карточки блюд
        document.addEventListener('click', (e) => {
            const dishCard = e.target.closest('.dish-card');
            if (dishCard) {
                this.handleDishSelection(dishCard);
            }
        });
        
        // Обработчики изменения select'ов в форме
        this.setupSelectListeners();
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
                select.addEventListener('change', (e) => {
                    this.handleSelectChange(category, e.target.value);
                });
            }
        });
    }
    
    handleDishSelection(dishCard) {
        const dishKeyword = dishCard.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === dishKeyword);
        
        if (dish) {
            this.selectedDishes[dish.category] = dish;
            this.updateOrderDisplay();
            this.syncSelects();
            this.highlightSelectedDishes();
        }
    }
    
    handleSelectChange(category, dishKeyword) {
        if (dishKeyword) {
            const dish = dishes.find(d => d.keyword === dishKeyword);
            if (dish) {
                this.selectedDishes[category] = dish;
            }
        } else {
            this.selectedDishes[category] = null;
        }
        this.updateOrderDisplay();
        this.highlightSelectedDishes();
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
            }
        });
    }
    
    updateOrderDisplay() {
        this.updateOrderSummary();
        this.updateTotalPrice();
    }
    
    updateOrderSummary() {
        const orderContainer = document.querySelector('.order-column');
        if (!orderContainer) return;
        
        let summaryContainer = orderContainer.querySelector('.order-summary');
        if (!summaryContainer) {
            summaryContainer = document.createElement('div');
            summaryContainer.className = 'order-summary';
            const orderColumn = orderContainer.querySelector('h3');
            if (orderColumn) {
                orderColumn.insertAdjacentElement('afterend', summaryContainer);
            }
        }
        
        summaryContainer.innerHTML = this.generateOrderSummaryHTML();
    }
    
    generateOrderSummaryHTML() {
        const hasSelectedDishes = Object.values(this.selectedDishes).some(dish => dish !== null);
        
        if (!hasSelectedDishes) {
            return '<div class="empty-order">Ничего не выбрано</div>';
        }
        
        let html = '<div class="order-summary-content"><h4>Ваш заказ:</h4>';
        
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
                    <div class="selected-dish">
                        <strong>${categoryNames[category]}:</strong> ${dish.name} - ${dish.price} руб.
                    </div>
                `;
            } else {
                html += `
                    <div class="empty-category">
                        <strong>${categoryNames[category]}:</strong> ${this.getNotSelectedText(category)}
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }
    
    getNotSelectedText(category) {
        const texts = {
            soup: 'Суп не выбран',
            salad: 'Салат не выбран',
            main: 'Блюдо не выбрано',
            drink: 'Напиток не выбран',
            dessert: 'Десерт не выбран'
        };
        return texts[category];
    }
    
    updateTotalPrice() {
        const total = Object.values(this.selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        let totalContainer = document.querySelector('.total-price');
        if (!totalContainer) {
            totalContainer = document.createElement('div');
            totalContainer.className = 'total-price';
            const orderSummary = document.querySelector('.order-summary');
            if (orderSummary) {
                orderSummary.appendChild(totalContainer);
            }
        }
        
        if (total > 0) {
            totalContainer.innerHTML = `<div class="total-price-content"><strong>Стоимость заказа:</strong> ${total} руб.</div>`;
            totalContainer.style.display = 'block';
        } else {
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
                }
            }
        });
    }
    
    // Метод для сброса заказа (для кнопки сброса формы)
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
    
    // Метод для получения выбранных блюд (для валидатора)
    getSelectedDishes() {
        return { ...this.selectedDishes };
    }
    
    // Метод для получения данных заказа для формы
    getOrderData() {
        return {
            ...this.selectedDishes,
            total: Object.values(this.selectedDishes)
                .filter(dish => dish !== null)
                .reduce((sum, dish) => sum + dish.price, 0)
        };
    }
}

// Инициализация менеджера заказов
let orderManager;

document.addEventListener('DOMContentLoaded', () => {
    orderManager = new OrderManager();
    
    // Обработчик для кнопки сброса формы
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Даем время форме сброситься, затем обновляем наш менеджер
            setTimeout(() => {
                orderManager.resetOrder();
            }, 100);
        });
    }
    
    // Обработчик для отправки формы
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            console.log('Данные заказа:', orderManager.getOrderData());
        });
    }
    
    console.log('OrderManager initialized successfully');
});