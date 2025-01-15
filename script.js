// متغير لتخزين تفاصيل السلة
let cart = [];

// تأثير التحميل والظهور التدريجي
window.addEventListener('load', function () {
    setTimeout(function () {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(function () {
            loadingScreen.style.display = 'none';
            const mainContent = document.getElementById('main-content');
            mainContent.style.display = 'block';
            mainContent.classList.add('visible');
        }, 800); 
    }, 1000); 
});

// إضافة المنتج إلى السلة
function addToCart(productId, productName) {
    const productPrice = getProductPrice(productId).price;
    if (productPrice <= 0) {
        alert('للاسف نفذت الكمية من هذا المنتج');
        return;
    }
    const productExists = cart.find(item => item.id === productId);

    if (productExists) {
        productExists.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }

    alert(`${productName} تمت إضافته إلى السلة.`);
}

// التمرير إلى نموذج الطلب
function scrollToOrderForm() {
    const orderFormSection = document.getElementById('order');
    if (orderFormSection) {
        orderFormSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeCart();
}

// الحصول على سعر المنتج
function getProductPrice(productId) {
    const prices = {
        101: { name: "كوب فاخر", price: 5 },
        102: { name: "كوب كلاسيكي", price: 4 },
        103: { name: "كوب عصري", price: 4 },
        104: { name: "دفتر ملاحظات", price: 3 }
    };
    return prices[productId] || { name: "غير معروف", price: 0 };
}

// حساب الإجمالي
function calculateTotal(includeDelivery = false, deliveryCost = 0) {
    const productsTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return includeDelivery ? productsTotal + deliveryCost : productsTotal;
}

// عرض السلة
function showCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فارغة.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <p>
                    ${item.name} - السعر: ${item.price} ريال - الكمية: ${item.quantity}
                    <button onclick="increaseQuantity(${index})">+</button>
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <button onclick="removeFromCart(${index})">حذف</button>
                </p>
            `;
            cartItems.appendChild(itemDiv);
        });
    }

    const deliveryCost = getDeliveryCost();
    cartTotal.textContent = `المجموع: ${calculateTotal(true, deliveryCost)} ريال`;

    cartModal.classList.add('visible');
    cartBackdrop.classList.add('visible');
}

// إغلاق السلة
function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartBackdrop = document.getElementById('cart-backdrop');
    cartModal.classList.remove('visible');
    cartBackdrop.classList.remove('visible');
}

// زيادة الكمية
function increaseQuantity(index) {
    cart[index].quantity += 1;
    showCart();
}

// تقليل الكمية
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    showCart();
}

// حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    showCart();
}

// تحديث خيارات التوصيل بناءً على المنطقة
function updateDeliveryOptions() {
    const region = document.getElementById("region").value;
    const delivery = document.getElementById("delivery");
    delivery.innerHTML = "";

    if (region === "السعادة") {
        delivery.innerHTML = `<option value="1">مندوب - 1 ريال</option>`;
    } else if (region === "صلالة" || region === "عوقد" || region === "صحلنوت") {
        delivery.innerHTML = `<option value="1.5">مندوب - 1.5 ريال</option>`;
    } else if (region === "مسقط" || region === "اخرى") {
        delivery.innerHTML = `
            <option value="1">نقليات - 1 ريال</option>
            <option value="2">مندوب إلى الباب - 2 ريال</option>
        `;
    } else {
        delivery.innerHTML = `<option value="">اختر طريقة التوصيل</option>`;
    }
}

// حساب تكلفة التوصيل
function getDeliveryCost() {
    const deliverySelect = document.getElementById("delivery");
    const selectedOption = deliverySelect.options[deliverySelect.selectedIndex];
    return parseFloat(selectedOption.value) || 0;
}

// إرسال الطلب عبر واتساب
function sendWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const region = document.getElementById("region").value;
    const delivery = document.getElementById("delivery").value;
    const notes = document.getElementById('notes').value.trim();
    const deliveryCost = getDeliveryCost();
    const includeDelivery = document.getElementById("includeDelivery").checked;

    if (!name || !address || !region || !delivery) {
        alert('يرجى ملء جميع الحقول المطلوبة!');
        return;
    }

    if (cart.length === 0) {
        alert('سلتك فارغة! يرجى إضافة منتجات.');
        return;
    }

    const total = calculateTotal(includeDelivery, deliveryCost);
    const productsMessage = cart.map(item => `- ${item.name} (الكمية: ${item.quantity}, السعر الإجمالي: ${item.price * item.quantity} ريال)`).join('\n');
    const message = 
        `مرحبًا، أريد تقديم طلب:\n` +
        `الاسم: ${name}\n` +
        `العنوان: ${address}\n` +
        `المنطقة: ${region}\n` +
        `التوصيل: ${delivery} ريال\n` +
        `المنتجات:\n${productsMessage}\n` +
        `المجموع: ${total} ريال\n` +
        `ملاحظات إضافية: ${notes || 'لا توجد ملاحظات'}\n`;

    const phone = '+96877267075';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
