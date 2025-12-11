class OrderValidator {
    constructor() {
        this.notificationContainer = null;
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        this.createNotificationContainer();
        this.setupFormValidation();
        this.disableBrowserValidation();
        this.isInitialized = true;
        
        console.log('OrderValidator initialized');
    }
    
    createNotificationContainer() {
        // Удаляем старый контейнер если есть
        const oldContainer = document.querySelector('.notifications-container');
        if (oldContainer) {
            oldContainer.remove();
        }
        
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notifications-container';
        document.body.appendChild(this.notificationContainer);
    }
    
    disableBrowserValidation() {
        // Форма теперь находится в .order-form-container
        const orderForm = document.querySelector('.order-form-container');
        if (orderForm) {
            orderForm.setAttribute('novalidate', 'novalidate');
        }
    }
    
    setupFormValidation() {
        // Находим кнопку отправки по новому селектору
        const submitBtn = document.querySelector('.submit-btn');
        
        if (submitBtn) {
            // Удаляем старые обработчики
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            
            // Добавляем обработчик на кнопку отправки
            newSubmitBtn.addEventListener('click', (e) => {
                this.handleSubmitClick(e);
            });
            
            console.log('Form validation setup complete');
        } else {
            console.error('Submit button not found');
        }
    }
    
    handleSubmitClick = (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
        
        // Сначала проверяем валидность заказа (состав ланча)
        const orderValidation = this.validateOrder();
        if (!orderValidation.isValid) {
            console.log('Order validation failed');
            this.showNotification(orderValidation.message, 'error');
            return;
        }
        
        // Затем проверяем личные данные
        const personalDataValidation = this.validatePersonalData();
        if (!personalDataValidation.isValid) {
            console.log('Personal data validation failed');
            this.showNotification(personalDataValidation.message, 'error');
            return;
        }
        
        console.log('All validations passed - submitting form');
        this.submitForm();
    }
    
    validateOrder() {
        console.log('Starting order validation');
        
        // Проверяем доступность orderManager
        if (typeof orderManager === 'undefined') {
            console.error('OrderManager is not defined');
            return {
                isValid: false,
                message: 'Ошибка системы. Пожалуйста, обновите страницу.'
            };
        }
        
        // Получаем текущие выбранные блюда
        const selectedDishes = orderManager.getSelectedDishes();
        console.log('Current selected dishes:', selectedDishes);
        
        const validationResult = this.checkLunchCombo(selectedDishes);
        
        if (!validationResult.isValid) {
            return {
                isValid: false,
                message: validationResult.message
            };
        }
        
        console.log('Order validation passed');
        return { isValid: true };
    }
    
    validatePersonalData() {
        console.log('Validating personal data');
        
        const requiredFields = [
            { id: 'name', name: 'Имя' },
            { id: 'email', name: 'Email' },
            { id: 'phone', name: 'Телефон' },
            { id: 'address', name: 'Адрес доставки' }
        ];
        
        const errors = [];
        
        // Проверяем обязательные поля
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !input.value.trim()) {
                errors.push(`• ${field.name} - обязательное поле`);
            }
        });
        
        // Проверяем выбор времени доставки
        const deliveryTimeSelected = document.querySelector('input[name="delivery_time"]:checked');
        if (!deliveryTimeSelected) {
            errors.push('• Выберите время доставки');
        }
        
        // Если выбрано конкретное время, проверяем его заполнение
        if (deliveryTimeSelected && deliveryTimeSelected.value === 'specific') {
            const timeInput = document.getElementById('delivery-time-input');
            if (timeInput && !timeInput.value) {
                errors.push('• Укажите конкретное время доставки');
            }
        }
        
        // Проверяем валидность email
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value.trim() && !this.isValidEmail(emailInput.value)) {
            errors.push('• Введите корректный email адрес');
        }
        
        // Проверяем валидность телефона (базовая проверка)
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value.trim()) {
            const phone = phoneInput.value.replace(/\D/g, '');
            if (phone.length < 10) {
                errors.push('• Введите корректный номер телефона (минимум 10 цифр)');
            }
        }
        
        if (errors.length > 0) {
            return {
                isValid: false,
                message: `Заполните следующие поля:<br><ul class="error-list">${errors.map(error => `<li>${error.replace('• ', '')}</li>`).join('')}</ul>`
            };
        }
        
        console.log('Personal data validation passed');
        return { isValid: true };
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    checkLunchCombo(selectedDishes) {
        const hasSoup = selectedDishes.soup !== null;
        const hasMain = selectedDishes.main !== null;
        const hasSalad = selectedDishes.salad !== null;
        const hasDrink = selectedDishes.drink !== null;
        const hasDessert = selectedDishes.dessert !== null;
        
        console.log('Combo check - hasSoup:', hasSoup, 'hasMain:', hasMain, 'hasSalad:', hasSalad, 'hasDrink:', hasDrink, 'hasDessert:', hasDessert);
        
        // Проверяем, что выбрано хотя бы одно блюдо
        if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
            console.log('Validation failed: Nothing selected');
            return {
                isValid: false,
                message: 'Ничего не выбрано. Выберите блюда для заказа'
            };
        }
        
        // Проверяем обязательный напиток
        if (!hasDrink) {
            console.log('Validation failed: No drink selected');
            return {
                isValid: false,
                message: 'Обязательно выберите напиток'
            };
        }
        
        // Проверяем варианты комбо из бизнес-ланчей
        const combo1 = hasSoup && hasMain && hasSalad && hasDrink;      // Полный обед
        const combo2 = hasSoup && hasMain && hasDrink;                  // Классический
        const combo3 = hasSoup && hasSalad && hasDrink;                 // Легкий
        const combo4 = hasMain && hasSalad && hasDrink;                 // Сытный
        const combo5 = hasMain && hasDrink;                             // Базовый
        
        const isValidCombo = combo1 || combo2 || combo3 || combo4 || combo5;
        
        console.log('Combo validation result:', isValidCombo);
        
        if (!isValidCombo) {
            if (!hasMain && !hasSalad) {
                console.log('Validation failed: No main dish or salad');
                return {
                    isValid: false,
                    message: 'Выберите главное блюдо или салат'
                };
            } else if (!hasSoup && !hasMain) {
                console.log('Validation failed: No soup or main dish');
                return {
                    isValid: false,
                    message: 'Выберите суп или главное блюдо'
                };
            } else if (!hasMain) {
                console.log('Validation failed: No main dish');
                return {
                    isValid: false,
                    message: 'Выберите главное блюдо'
                };
            }
        }
        
        console.log('Validation passed: Valid combo selected');
        return { isValid: true };
    }
    
    submitForm() {
        console.log('Preparing to submit form');
        
        // Создаем временную форму для отправки данных
        this.createTemporaryFormAndSubmit();
    }
    
    createTemporaryFormAndSubmit() {
        // Создаем временную форму
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = 'https://httpbin.org/post';
        tempForm.style.display = 'none';
        
        // Собираем данные о блюдах
        const selectedDishes = orderManager.getSelectedDishes();
        
        // Добавляем данные о блюдах
        Object.entries(selectedDishes).forEach(([category, dish]) => {
            if (dish) {
                const input1 = document.createElement('input');
                input1.type = 'hidden';
                input1.name = `selected_${category}`;
                input1.value = dish.name;
                tempForm.appendChild(input1);
                
                const input2 = document.createElement('input');
                input2.type = 'hidden';
                input2.name = `selected_${category}_price`;
                input2.value = dish.price.toString();
                tempForm.appendChild(input2);
            }
        });
        
        // Добавляем личные данные
        const fields = ['name', 'email', 'phone', 'address', 'comment'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = fieldId;
                input.value = field.value;
                tempForm.appendChild(input);
            }
        });
        
        // Добавляем время доставки
        const deliveryTimeSelected = document.querySelector('input[name="delivery_time"]:checked');
        if (deliveryTimeSelected) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'delivery_time';
            input.value = deliveryTimeSelected.value;
            tempForm.appendChild(input);
        }
        
        // Добавляем конкретное время, если указано
        const timeInput = document.getElementById('delivery-time-input');
        if (timeInput && timeInput.value) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'delivery_time_input';
            input.value = timeInput.value;
            tempForm.appendChild(input);
        }
        
        // Добавляем подписку на рассылку
        const newsletter = document.getElementById('newsletter');
        if (newsletter) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'newsletter';
            input.value = newsletter.checked ? 'yes' : 'no';
            tempForm.appendChild(input);
        }
        
        // Сначала показываем подтверждение заказа
        const orderSummary = this.getOrderSummary();
        this.showOrderConfirmation(orderSummary, () => {
            // После подтверждения добавляем форму на страницу и отправляем
            document.body.appendChild(tempForm);
            tempForm.submit();
        });
    }
    
    getOrderSummary() {
        const selectedDishes = orderManager.getSelectedDishes();
        const total = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        const categoryNames = {
            soup: 'Суп',
            salad: 'Салат',
            main: 'Главное блюдо',
            drink: 'Напиток',
            dessert: 'Десерт'
        };
        
        let summary = '<h4>Детали заказа:</h4>';
        
        Object.entries(selectedDishes).forEach(([category, dish]) => {
            if (dish) {
                summary += `<p><strong>${categoryNames[category]}:</strong> ${dish.name} - ${dish.price} руб.</p>`;
            }
        });
        
        summary += `<p><strong>Итого:</strong> ${total} руб.</p>`;
        
        // Добавляем данные клиента
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        
        summary += `<hr><h4>Данные клиента:</h4>`;
        summary += `<p><strong>Имя:</strong> ${name}</p>`;
        summary += `<p><strong>Email:</strong> ${email}</p>`;
        summary += `<p><strong>Адрес:</strong> ${address}</p>`;
        summary += `<p><strong>Телефон:</strong> ${phone}</p>`;
        
        return summary;
    }
    
    showOrderConfirmation(orderSummary, onConfirm) {
        const notification = document.createElement('div');
        notification.className = 'notification confirmation';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Подтверждение заказа</h3>
                <div class="order-summary-details">
                    ${orderSummary}
                </div>
                <p>Всё верно?</p>
                <div class="confirmation-buttons">
                    <button class="notification-cancel-btn">Изменить</button>
                    <button class="notification-confirm-btn">Подтвердить заказ</button>
                </div>
            </div>
            <div class="notification-overlay"></div>
        `;
        
        this.showCustomNotification(notification);
        
        // Обработчики кнопок
        const cancelBtn = notification.querySelector('.notification-cancel-btn');
        const confirmBtn = notification.querySelector('.notification-confirm-btn');
        
        cancelBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        confirmBtn.addEventListener('click', () => {
            this.hideNotification(notification);
            onConfirm();
        });
        
        // Закрытие по overlay
        const overlay = notification.querySelector('.notification-overlay');
        overlay.addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }
    
    showSuccessNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Успех!</h3>
                <p>Ваш заказ успешно отправлен!</p>
                <div class="success-details">
                    <p>Мы свяжемся с вами для подтверждения заказа.</p>
                    <p>Спасибо, что выбрали наш сервис!</p>
                </div>
                <button class="notification-ok-btn">Отлично</button>
            </div>
            <div class="notification-overlay"></div>
        `;
        
        this.showCustomNotification(notification);
    }
    
    showNotification(message, type = 'error') {
        console.log(`Showing ${type} notification:`, message);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h3>${type === 'error' ? 'Внимание!' : 'Информация'}</h3>
                <div class="notification-message">${message}</div>
                <button class="notification-ok-btn">Окей</button>
            </div>
            <div class="notification-overlay"></div>
        `;
        
        this.showCustomNotification(notification);
    }
    
    showCustomNotification(notification) {
        // Удаляем существующие уведомления
        const existingNotifications = this.notificationContainer.querySelectorAll('.notification');
        existingNotifications.forEach(existingNotification => {
            this.hideNotification(existingNotification);
        });
        
        // Добавляем новое уведомление
        this.notificationContainer.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Обработчики закрытия
        this.setupNotificationCloseHandlers(notification);
    }
    
    setupNotificationCloseHandlers(notification) {
        // Кнопка "Окей"
        const okBtn = notification.querySelector('.notification-ok-btn');
        if (okBtn) {
            okBtn.addEventListener('click', () => {
                this.hideNotification(notification);
            });
        }
        
        // Overlay
        const overlay = notification.querySelector('.notification-overlay');
        overlay.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // Клавиша ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideNotification(notification);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        notification._escHandler = escHandler;
    }
    
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                if (notification._escHandler) {
                    document.removeEventListener('keydown', notification._escHandler);
                }
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Инициализация
let orderValidator;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing OrderValidator');
    
    // Даем время другим скриптам загрузиться
    setTimeout(() => {
        orderValidator = new OrderValidator();
        window.orderValidator = orderValidator; // Делаем глобальной для тестирования
        
        console.log('OrderValidator initialized successfully');
        console.log('System ready - form validation is active');
    }, 500);
});
