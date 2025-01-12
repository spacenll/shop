// متغير لتخزين تفاصيل السلة
let cart = [];

// إضافة المنتج إلى السلة
function addToCart(productId, productName) {
    const productPrice = getProductPrice(productId); // الحصول على السعر بناءً على المنتج
    const productExists = cart.find(item => item.id === productId);

    if (productExists) {
        productExists.quantity += 1; // زيادة العدد إذا كان المنتج موجودًا
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 }); // إضافة منتج جديد
    }

    alert(`${productName} تمت إضافته إلى السلة.`);
}

// الحصول على سعر المنتج بناءً على معرف المنتج
function getProductPrice(productId) {
    if (productId === 101) return 5; // سعر كوب فاخر
    if (productId === 102) return 4; // سعر كوب كلاسيكي
    if (productId === 103) return 4; // سعر كوب عصري
    return 0;
}
function toggleCart() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.classList.toggle('visible'); // إضافة أو إزالة الصندوق
    }
}
// حساب المجموع الإجمالي
function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// عرض السلة
function showCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // تفريغ المحتوى القديم
    cartItems.innerHTML = '';

    // إذا كانت السلة فارغة
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فارغة.</p>';
    } else {
        // عرض المنتجات في السلة
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

    // تحديث المجموع
    cartTotal.textContent = `المجموع: ${calculateTotal()} ريال`;

    // عرض النافذة
    cartModal.classList.remove('hidden');
}

// إغلاق السلة
function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.add('hidden');
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
        cart.splice(index, 1); // إزالة المنتج إذا كانت الكمية 1
    }
    showCart();
}

// حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    showCart();
}

// إرسال الطلب عبر واتساب
function sendWhatsApp() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;

    if (!name || !address || cart.length === 0) {
        alert('يرجى ملء جميع الحقول المطلوبة وإضافة منتج إلى السلة!');
        return;
    }

    const productsMessage = cart.map(item => `- ${item.name} (الكمية: ${item.quantity}, السعر الإجمالي: ${item.price * item.quantity} ريال)`).join('\n');
    const total = calculateTotal();
    const message = 
        `مرحبا، أريد تقديم طلب:\n` +
        `الاسم: ${name}\n` +
        `العنوان: ${address}\n` +
        `المنتجات:\n${productsMessage}\n` +
        `المجموع الإجمالي: ${total} ريال\n` +
        `ملاحظات إضافية: ${notes || 'لا توجد ملاحظات'}\n`;

    const phone = '+96877267075';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// إضافة تأثير Fade عند التمرير
document.addEventListener("scroll", () => {
    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 50) {
            section.classList.add("visible");
        }
    });
});
