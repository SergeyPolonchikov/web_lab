class OrderValidator {
    constructor() {
        this.notificationContainer = null;
        this.init();
    }
    
    init() {
        this.createNotificationContainer();
        this.setupNotificationStyles();
        this.setupFormValidation();
        this.disableBrowserValidation();
        console.log('OrderValidator initialized');
    }
    
    createNotificationContainer() {
        const oldContainer = document.querySelector('.notifications-container');
        if (oldContainer) {
            oldContainer.remove();
        }
        
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notifications-container';
        document.body.appendChild(this.notificationContainer);
    }
    
    setupNotificationStyles() {
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notifications-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    pointer-events: none;
                }
                
                .notification {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    z-index: 10001;
                }
                
                .notification.show {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: all;
                }
                
                .notification-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                }
                
                .notification-content {
                    position: relative;
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    max-width: 450px;
                    width: 90%;
                    z-index: 10002;
                    animation: slideInUp 0.3s ease-out;
                }
                
                @keyframes slideInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .success-icon {
                    font-size: 50px;
                    color: #4CAF50;
                    margin-bottom: 20px;
                    text-align: center;
                }
                
                .notification h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #2E7D32;
                    font-size: 24px;
                    text-align: center;
                    font-weight: 600;
                }
                
                .notification p {
                    color: #555;
                    margin-bottom: 20px;
                    line-height: 1.5;
                    text-align: center;
                    font-size: 16px;
                }
                
                .order-details {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin: 20px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                }
                
                .detail-label {
                    font-weight: 500;
                    color: #666;
                    font-size: 14px;
                }
                
                .detail-value {
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }
                
                .notification-ok-btn {
                    background: #2196F3;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: block;
                    margin: 20px auto 0;
                    min-width: 150px;
                }
                
                .notification-ok-btn:hover {
                    background: #1976D2;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
                }
                
                /* Стили для ошибок */
                .notification.error .notification-content {
                    border-top: 4px solid #f44336;
                }
                
                .notification.error h3 {
                    color: #d32f2f;
                }
                
                .error-list {
                    margin: 15px 0;
                    padding-left: 20px;
                    text-align: left;
                }
                
                .error-list li {
                    margin: 8px 0;
                    color: #d32f2f;
                    font-size: 15px;
                }
                
                @media (max-width: 480px) {
                    .notification-content {
                        padding: 25px 20px;
                    }
                    
                    .success-icon {
                        font-size: 40px;
                    }
                    
                    .notification h3 {
                        font-size: 20px;
                    }
                    
                    .notification-ok-btn {
                        padding: 10px 20px;
                        font-size: 15px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    disableBrowserValidation() {
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.setAttribute('novalidate', 'novalidate');
        }
    }
    
    setupFormValidation() {
        const submitBtn = document.querySelector('.submit-btn');
        
        if (submitBtn) {
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            
            newSubmitBtn.addEventListener('click', (e) => {
                this.handleSubmitClick(e);
            });
            
            console.log('Form validation setup complete');
        }
    }
    
    handleSubmitClick = (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
        
        // Проверяем валидность заказа
        const orderValidation = this.validateOrder();
        if (!orderValidation.isValid) {
            this.showNotification(orderValidation.message, 'error');
            return;
        }
        
        // Проверяем личные данные
        const personalDataValidation = this.validatePersonalData();
        if (!personalDataValidation.isValid) {
            this.showNotification(personalDataValidation.message, 'error');
            return;
        }
        
        console.log('All validations passed');
        this.showSuccessNotification();
        this.resetForm();
    }
    
    validateOrder() {
        console.log('Validating order');
        
        if (typeof orderManager === 'undefined') {
            return {
                isValid: false,
                message: 'Ошибка системы. Пожалуйста, обновите страницу.'
            };
        }
        
        const selectedDishes = orderManager.getSelectedDishes();
        console.log('Selected dishes:', selectedDishes);
        
        const validationResult = this.checkLunchCombo(selectedDishes);
        
        if (!validationResult.isValid) {
            return {
                isValid: false,
                message: validationResult.message
            };
        }
        
        return { isValid: true };
    }
    
    validatePersonalData() {
        const requiredFields = [
            { id: 'name', name: 'Имя' },
            { id: 'email', name: 'Email' },
            { id: 'phone', name: 'Телефон' },
            { id: 'address', name: 'Адрес доставки' }
        ];
        
        const errors = [];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !input.value.trim()) {
                errors.push(`${field.name} - обязательное поле`);
            }
        });
        
        const deliveryTimeSelected = document.querySelector('input[name="delivery_time"]:checked');
        if (!deliveryTimeSelected) {
            errors.push('Выберите время доставки');
        }
        
        if (deliveryTimeSelected && deliveryTimeSelected.value === 'specific') {
            const timeInput = document.getElementById('delivery-time-input');
            if (timeInput && !timeInput.value) {
                errors.push('Укажите конкретное время доставки');
            }
        }
        
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value.trim() && !this.isValidEmail(emailInput.value)) {
            errors.push('Введите корректный email адрес');
        }
        
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value.trim()) {
            const phone = phoneInput.value.replace(/\D/g, '');
            if (phone.length < 10) {
                errors.push('Введите корректный номер телефона (минимум 10 цифр)');
            }
        }
        
        if (errors.length > 0) {
            return {
                isValid: false,
                message: `Заполните следующие поля:<br><ul class="error-list">${errors.map(error => `<li>${error}</li>`).join('')}</ul>`
            };
        }
        
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
        
        // Проверяем, что выбрано хотя бы одно блюдо
        if (!hasSoup && !hasMain && !hasSalad && !hasDrink) {
            return {
                isValid: false,
                message: 'Ничего не выбрано. Выберите блюда для заказа'
            };
        }
        
        // Проверяем обязательный напиток
        if (!hasDrink) {
            return {
                isValid: false,
                message: 'Обязательно выберите напиток'
            };
        }
        
        // Проверяем варианты комбо
        const combo1 = hasSoup && hasMain && hasSalad && hasDrink;
        const combo2 = hasSoup && hasMain && hasDrink;
        const combo3 = hasSoup && hasSalad && hasDrink;
        const combo4 = hasMain && hasSalad && hasDrink;
        const combo5 = hasMain && hasDrink;
        
        const isValidCombo = combo1 || combo2 || combo3 || combo4 || combo5;
        
        if (!isValidCombo) {
            if (!hasMain && !hasSalad) {
                return {
                    isValid: false,
                    message: 'Выберите главное блюдо или салат'
                };
            } else if (!hasSoup && !hasMain) {
                return {
                    isValid: false,
                    message: 'Выберите суп или главное блюдо'
                };
            } else if (!hasMain) {
                return {
                    isValid: false,
                    message: 'Выберите главное блюдо'
                };
            }
        }
        
        return { isValid: true };
    }
    
    showSuccessNotification() {
        const selectedDishes = orderManager.getSelectedDishes();
        const total = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        const selectedItems = Object.entries(selectedDishes)
            .filter(([_, dish]) => dish !== null)
            .map(([_, dish]) => dish.name)
            .join(', ');
        
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <div class="notification-overlay"></div>
            <div class="notification-content">
                <div class="success-icon">✓</div>
                <h3>Заказ успешно отправлен!</h3>
                <p>Спасибо за ваш заказ. Мы получили его и скоро свяжемся с вами для подтверждения.</p>
                
                <div class="order-details">
                    <div class="detail-item">
                        <span class="detail-label">Итого:</span>
                        <span class="detail-value">${total} руб.</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Время:</span>
                        <span class="detail-value">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                
                ${selectedItems ? `<p style="margin-top: 15px; font-size: 14px; color: #666;">Ваш заказ: ${selectedItems}</p>` : ''}
                
                <button class="notification-ok-btn">Продолжить</button>
            </div>
        `;
        
        this.showCustomNotification(notification);
        
        const okBtn = notification.querySelector('.notification-ok-btn');
        okBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }
    
    resetForm() {
        setTimeout(() => {
            orderManager.resetOrder();
            
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('address').value = '';
            document.getElementById('comment').value = '';
            
            document.querySelectorAll('input[name="delivery_time"]').forEach(radio => {
                radio.checked = false;
            });
            
            const timeInput = document.getElementById('delivery-time-input');
            if (timeInput) timeInput.value = '';
            
            const newsletterCheckbox = document.getElementById('newsletter');
            if (newsletterCheckbox) {
                newsletterCheckbox.checked = true;
            }
            
        }, 100);
    }
    
    showNotification(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-overlay"></div>
            <div class="notification-content">
                <h3>${type === 'error' ? 'Внимание!' : 'Информация'}</h3>
                <div class="notification-message">${message}</div>
                <button class="notification-ok-btn">Окей</button>
            </div>
        `;
        
        this.showCustomNotification(notification);
    }
    
    showCustomNotification(notification) {
        const existingNotifications = this.notificationContainer.querySelectorAll('.notification');
        existingNotifications.forEach(existingNotification => {
            this.hideNotification(existingNotification);
        });
        
        this.notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        this.setupNotificationCloseHandlers(notification);
    }
    
    setupNotificationCloseHandlers(notification) {
        const overlay = notification.querySelector('.notification-overlay');
        overlay.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        const okBtn = notification.querySelector('.notification-ok-btn');
        if (okBtn) {
            okBtn.addEventListener('click', () => {
                this.hideNotification(notification);
            });
        }
        
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

let orderValidator;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing OrderValidator');
    
    setTimeout(() => {
        orderValidator = new OrderValidator();
        window.orderValidator = orderValidator;
        
        console.log('OrderValidator initialized successfully');
    }, 500);
});

