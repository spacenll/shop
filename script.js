// متغير لتخزين تفاصيل السلة

    let cart = [];
// تأثير التحميل والظهور التدريجي
document.addEventListener('DOMContentLoaded', function () {
    // بدء التحميل بعد تحميل الصفحة
    setTimeout(function () {
        // الحصول على عنصر شاشة التحميل
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // تخفي شاشة التحميل تدريجيًا
            loadingScreen.style.opacity = '0';
            setTimeout(function () {
                loadingScreen.style.display = 'none';

                // إظهار المحتوى الرئيسي
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.classList.add('visible');
                } 
            }, 800); // تأخير اختفاء شاشة التحميل
        } else {
            console.error('Element with id "loading-screen" not found.');
        }
    }, 1000); // تأخير بدء الانتقال
});


// إضافة المنتج إلى السلة
function addToCart(productId, productName) {
    const productPrice = getProductPrice(productId).price;
    if (productPrice <= 0) {
         Swal.fire({
            title: 'عذراً',
            text: 'لقد نفذت الكمية من هذا المنتج, اختر شيء اخر.',
            icon: 'warning',
            confirmButtonText: 'حسنًا'
        });
        return;
    }
    const productExists = cart.find(item => item.id === productId);

    if (productExists) {
        productExists.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }


     Swal.fire({
        title: 'تمت الإضافة!',
    text: `ㅤㅤㅤㅤㅤㅤتمت اضافة ${productName} الى السلة ㅤㅤㅤㅤㅤ صار بإمكانك ترسل طلبك او تضيف منتج ثاني لو تحب`,
        icon: 'success',
        confirmButtonText: 'اوك'
    });

    updateCartTotal();
 
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartTotalElement = document.getElementById('total-cart');
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `${total} ريال`;
    }
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
    const productTotal = document.getElementById('product-total');
   const delivery = document.getElementById('delivery-cost');
    
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
    const productsTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0); // إجمالي المنتجات

    productTotal.textContent = `المجموع الكلي: ${calculateTotal(true, deliveryCost)} ريال`;
    delivery.textContent = `تكلفة التوصيل: ${deliveryCost} ريال`;
    cartTotal.textContent = `${productsTotal} ريال`;
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
    } else if (region === "مسقط" || region === "اخرى (اذكرها في الملاحظات)") {
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
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const region = document.getElementById("region").value;
    const delivery = document.getElementById("delivery").value;
    const notes = document.getElementById('notes').value.trim();
    const deliveryCost = getDeliveryCost();
    const includeDelivery = document.getElementById("includeDelivery").checked;

    if (!name || !phone || !address || !region || !delivery) {
         Swal.fire({
            title: 'ملاحظة',
            text: 'يرجى تعبئة جميع المدخلات المطلوبة',
            icon: 'warning',
            confirmButtonText: 'حسنًا'
        });
        return;
    }

    if (cart.length === 0) {
            Swal.fire({
            title: 'ملاحظة',
            text: 'سلتك فارغة! يرجى إضافة منتجات',
            icon: 'warning',
            confirmButtonText: 'حسنًا'
        });
     
        return;
    }

    const total = calculateTotal(includeDelivery, deliveryCost);
    const productsMessage = cart.map(item => `- ${item.name} (الكمية: ${item.quantity}, السعر : ${item.price * item.quantity}  ريال عماني)`).join('\n');
    const message = 
        `مرحبًا، أريد تقديم طلب:\n` +
        `الاسم: ${name}\n` +
         `الرقم: ${phone}\n` +
        `العنوان: ${address}\n` +
        `المنطقة: ${region}\n` +
        `المنتجات:\n${productsMessage}\n` +
        `مبلغ التوصيل: ${delivery} ريال\n` +
        `المجموع الكلي: ${total} ريال\n` +
        `ملاحظات إضافية: ${notes || '-'}`;

    const phone = '+96877267075';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
