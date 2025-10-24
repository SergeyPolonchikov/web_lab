class OrderManager {
    constructor() {
        this.selectedDishes = {
            soup: null,
            salad: null,
            main: null,
            drink: null
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
    }
    
    handleDishSelection(dishCard) {
        const dishKeyword = dishCard.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === dishKeyword);
        
        if (dish) {
            this.selectedDishes[dish.category] = dish;
            this.updateOrderDisplay();
        }
    }
    
    updateOrderDisplay() {
        this.updateSelects();
        this.updateOrderSummary();
        this.updateTotalPrice();
    }
    
    updateSelects() {
        // Обновляем select'ы в форме
        const categories = ['soup', 'main', 'drink'];
        
        categories.forEach(category => {
            const select = document.getElementById(this.getSelectId(category));
            if (select && this.selectedDishes[category]) {
                select.value = this.selectedDishes[category].keyword;
            }
        });
    }
    
    getSelectId(category) {
        const selectIds = {
            soup: 'soup',
            main: 'main-course',
            drink: 'drink'
        };
        return selectIds[category];
    }
    
    updateOrderSummary() {
        const orderContainer = document.querySelector('.order-column');
        if (!orderContainer) return;
        
        // Создаем или находим контейнер для сводки заказа
        let summaryContainer = orderContainer.querySelector('.order-summary');
        if (!summaryContainer) {
            summaryContainer = document.createElement('div');
            summaryContainer.className = 'order-summary';
            orderContainer.insertBefore(summaryContainer, orderContainer.firstChild);
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
            drink: 'Напиток'
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
            drink: 'Напиток не выбран'
        };
        return texts[category];
    }
    
    updateTotalPrice() {
        const total = Object.values(this.selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        // Создаем или обновляем блок с общей стоимостью
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
});