const dishes = [
    // Супы (6 блюд)
    {
        keyword: "tom-yam",
        name: "Том Ям с креветками",
        price: 290,
        category: "soup",
        count: "300 мл",
        image: "soup1.jpg",
        kind: "fish"
    },
    {
        keyword: "mushroom-cream",
        name: "Грибной крем-суп",
        price: 260,
        category: "soup",
        count: "300 мл",
        image: "soup2.jpg",
        kind: "veg"
    },
    {
        keyword: "borscht",
        name: "Борщ с говядиной",
        price: 250,
        category: "soup",
        count: "300 мл",
        image: "soup3.jpg",
        kind: "meat"
    },
    {
        keyword: "chicken-noodle",
        name: "Куриный суп с лапшой",
        price: 240,
        category: "soup",
        count: "300 мл",
        image: "soup4.jpg",
        kind: "meat"
    },
    {
        keyword: "fish-soup",
        name: "Уха царская",
        price: 320,
        category: "soup",
        count: "300 мл",
        image: "soup5.jpg",
        kind: "fish"
    },
    {
        keyword: "vegetable-soup",
        name: "Овощной суп-пюре",
        price: 220,
        category: "soup",
        count: "300 мл",
        image: "soup6.jpg",
        kind: "veg"
    },

    // Салаты и стартеры (6 блюд)
    {
        keyword: "greek-salad",
        name: "Греческий салат",
        price: 280,
        category: "salad",
        count: "250 г",
        image: "salad1.jpg",
        kind: "veg"
    },
    {
        keyword: "caesar-chicken",
        name: "Цезарь с курицей",
        price: 320,
        category: "salad",
        count: "280 г",
        image: "salad2.jpg",
        kind: "meat"
    },
    {
        keyword: "vegetable-salad",
        name: "Овощной салат",
        price: 240,
        category: "salad",
        count: "230 г",
        image: "salad3.jpg",
        kind: "veg"
    },
    {
        keyword: "tuna-salad",
        name: "Салат с тунцом",
        price: 300,
        category: "salad",
        count: "260 г",
        image: "salad4.jpg",
        kind: "fish"
    },
    {
        keyword: "quinoa-salad",
        name: "Салат с киноа",
        price: 270,
        category: "salad",
        count: "240 г",
        image: "salad5.jpg",
        kind: "veg"
    },
    {
        keyword: "avocado-salad",
        name: "Салат с авокадо",
        price: 290,
        category: "salad",
        count: "250 г",
        image: "salad6.jpg",
        kind: "veg"
    },

    // Главные блюда (6 блюд)
    {
        keyword: "teriyaki-chicken",
        name: "Курица терияки с рисом",
        price: 350,
        category: "main",
        count: "350 г",
        image: "main1.jpg",
        kind: "meat"
    },
    {
        keyword: "carbonara",
        name: "Паста Карбонара",
        price: 320,
        category: "main",
        count: "350 г",
        image: "main2.jpg",
        kind: "meat"
    },
    {
        keyword: "beef-stroganoff",
        name: "Бефстроганов с пюре",
        price: 380,
        category: "main",
        count: "400 г",
        image: "main3.jpg",
        kind: "meat"
    },
    {
        keyword: "salmon",
        name: "Лосось на пару с брокколи",
        price: 420,
        category: "main",
        count: "300 г",
        image: "main4.jpg",
        kind: "fish"
    },
    {
        keyword: "vegetable-stew",
        name: "Овощное рагу с тофу",
        price: 280,
        category: "main",
        count: "350 г",
        image: "main5.jpg",
        kind: "veg"
    },
    {
        keyword: "kiev-cutlet",
        name: "Котлета по-киевски",
        price: 340,
        category: "main",
        count: "380 г",
        image: "main6.jpg",
        kind: "meat"
    },
    
    // Напитки (6 блюд)
    {
        keyword: "berry-juice",
        name: "Морс ягодный",
        price: 120,
        category: "drink",
        count: "330 мл",
        image: "drink1.jpg",
        kind: "cold"
    },
    {
        keyword: "tea",
        name: "Чай черный/зеленый",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "drink2.jpg",
        kind: "hot"
    },
    {
        keyword: "coffee",
        name: "Кофе американо",
        price: 130,
        category: "drink",
        count: "250 мл",
        image: "drink3.jpg",
        kind: "hot"
    },
    {
        keyword: "orange-juice",
        name: "Сок апельсиновый",
        price: 110,
        category: "drink",
        count: "330 мл",
        image: "drink4.jpg",
        kind: "cold"
    },
    {
        keyword: "lemonade",
        name: "Домашний лимонад",
        price: 130,
        category: "drink",
        count: "330 мл",
        image: "drink5.jpg",
        kind: "cold"
    },
    {
        keyword: "cappuccino",
        name: "Капучино",
        price: 150,
        category: "drink",
        count: "250 мл",
        image: "drink6.jpg",
        kind: "hot"
    },

    // Десерты (6 блюд)
    {
        keyword: "tiramisu-small",
        name: "Тирамису",
        price: 180,
        category: "dessert",
        count: "120 г",
        image: "dessert1.jpg",
        kind: "small"
    },
    {
        keyword: "cheesecake-small",
        name: "Чизкейк",
        price: 160,
        category: "dessert",
        count: "100 г",
        image: "dessert2.jpg",
        kind: "small"
    },
    {
        keyword: "fruit-salad-small",
        name: "Фруктовый салат",
        price: 140,
        category: "dessert",
        count: "150 г",
        image: "dessert3.jpg",
        kind: "small"
    },
    {
        keyword: "chocolate-cake",
        name: "Шоколадный торт",
        price: 220,
        category: "dessert",
        count: "180 г",
        image: "dessert4.jpg",
        kind: "medium"
    },
    {
        keyword: "apple-pie",
        name: "Яблочный пирог",
        price: 190,
        category: "dessert",
        count: "200 г",
        image: "dessert5.jpg",
        kind: "medium"
    },
    {
        keyword: "ice-cream-large",
        name: "Мороженое ассорти",
        price: 280,
        category: "dessert",
        count: "300 г",
        image: "dessert6.jpg",
        kind: "large"
    }
];