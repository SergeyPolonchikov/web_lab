class OrderValidator {
    constructor() {
        this.notificationContainer = null;
        this.init();
    }
    
    init() {
        this.createNotificationContainer();
        this.setupFormValidation();
        this.disableBrowserValidation();
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
        
        console.log('Notification container created');
    }
    
    disableBrowserValidation() {
        const orderForm = document.querySelector('.order-form');
        if (orderForm) {
            // Отключаем браузерную валидацию
            orderForm.setAttribute('novalidate', 'novalidate');
            console.log('Browser validation disabled');
        }
    }
    
    setupFormValidation() {
        const orderForm = document.querySelector('.order-form');
        const submitBtn = document.querySelector('.submit-btn');
        
        if (orderForm && submitBtn) {
            // Удаляем все старые обработчики путем замены кнопки
            submitBtn.replaceWith(submitBtn.cloneNode(true));
            
            // Получаем обновленную кнопку
            const newSubmitBtn = document.querySelector('.submit-btn');
            
            // Добавляем обработчик на кнопку отправки
            newSubmitBtn.addEventListener('click', (e) => {
                this.handleSubmitClick(e);
            });
            
            console.log('Form validation setup complete');
        } else {
            console.error('Form or submit button not found');
        }
    }
    
    handleSubmitClick = (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
        
        // Сначала проверяем валидность заказа
        if (!this.validateOrder()) {
            console.log('Order validation failed');
            return;
        }
        
        // Затем проверяем личные данные
        if (this.validatePersonalData()) {
            console.log('All validations passed - submitting form');
            this.submitForm();
        } else {
            console.log('Personal data validation failed');
        }
    }
    
    validateOrder() {
        console.log('Starting order validation');
        
        // Проверяем доступность orderManager
        if (typeof orderManager === 'undefined') {
            console.error('OrderManager is not defined');
            this.showNotification('Ошибка системы. Пожалуйста, обновите страницу.');
            return false;
        }
        
        // Получаем текущие выбранные блюда
        const selectedDishes = orderManager.getSelectedDishes();
        console.log('Current selected dishes:', selectedDishes);
        
        const validationResult = this.checkLunchCombo(selectedDishes);
        
        if (!validationResult.isValid) {
            this.showNotification(validationResult.message);
            return false;
        }
        
        console.log('Order validation passed');
        return true;
    }
    
    validatePersonalData() {
        console.log('Validating personal data');
        
        const requiredFields = [
            { id: 'name', name: 'Имя' },
            { id: 'email', name: 'Email' },
            { id: 'phone', name: 'Телефон' },
            { id: 'address', name: 'Адрес доставки' }
        ];
        
        const missingFields = [];
        
        // Проверяем обязательные поля
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !input.value.trim()) {
                missingFields.push(field.name);
            }
        });
        
        // Проверяем выбор времени доставки
        const deliveryTimeSelected = document.querySelector('input[name="delivery_time"]:checked');
        if (!deliveryTimeSelected) {
            missingFields.push('Время доставки');
        }
        
        // Если есть незаполненные поля, показываем уведомление
        if (missingFields.length > 0) {
            const message = `Заполните обязательные поля:\n${missingFields.join('\n')}`;
            this.showNotification(message);
            return false;
        }
        
        // Проверяем валидность email
        const emailInput = document.getElementById('email');
        if (emailInput && !this.isValidEmail(emailInput.value)) {
            this.showNotification('Введите корректный email адрес');
            return false;
        }
        
        console.log('Personal data validation passed');
        return true;
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
        
        console.log('Combo check - hasSoup:', hasSoup, 'hasMain:', hasMain, 'hasSalad:', hasSalad, 'hasDrink:', hasDrink);
        
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
                message: 'Выберите напиток'
            };
        }
        
        // Проверяем варианты комбо
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
                    message: 'Выберите главное блюдо/салат/стартер'
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
        console.log('Submitting form to httpbin');
        const form = document.querySelector('.order-form');
        
        if (!form) {
            console.error('Form not found');
            return;
        }
        
        // Собираем данные формы
        const formData = new FormData(form);
        
        // Добавляем данные о выбранных блюдах
        const selectedDishes = orderManager.getSelectedDishes();
        Object.entries(selectedDishes).forEach(([category, dish]) => {
            if (dish) {
                formData.append(`selected_${category}`, dish.name);
                formData.append(`selected_${category}_price`, dish.price.toString());
            }
        });
        
        // Отправляем форму
        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Form submitted successfully:', data);
            this.showSuccessNotification();
        })
        .catch(error => {
            console.error('Form submission error:', error);
            this.showNotification('Произошла ошибка при отправке заказа');
        });
    }
    
    showSuccessNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Успех!</h3>
                <p>Ваш заказ успешно отправлен!</p>
                <p class="success-details">Мы свяжемся с вами для подтверждения заказа.</p>
                <button class="notification-ok-btn">Отлично</button>
            </div>
            <div class="notification-overlay"></div>
        `;
        
        this.showCustomNotification(notification);
    }
    
    showNotification(message) {
        console.log('Showing error notification:', message);
        
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Внимание!</h3>
                <p>${message}</p>
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
        okBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
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
