// متغير لتخزين تفاصيل السلة
let cart = [];

   // JavaScript to handle the loading screen and fade effects
    window.addEventListener('load', function () {
      setTimeout(function () {
        // Fade out the loading screen
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';

        // Wait for the fade-out transition to complete
        setTimeout(function () {
          loadingScreen.style.display = 'none';
          // Show the main content with a fade-in effect
          const mainContent = document.getElementById('main-content');
          mainContent.style.display = 'block';
          mainContent.classList.add('visible');
        }, 800); // Matches the fade-out transition duration
      }, 1500); // 1.5 seconds before fading starts
    });

// إضافة المنتج إلى السلة
function addToCart(productId, productName) {
    const productPrice = getProductPrice(productId); // الحصول على السعر بناءً على المنتج
    if (productPrice <= 0) {
        alert('للاسف نفذت الكمية من هذا المنتج');
        return;
    }
    const productExists = cart.find(item => item.id === productId);

    if (productExists) {
        productExists.quantity += 1; // زيادة العدد إذا كان المنتج موجودًا
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 }); // إضافة منتج جديد
    }

    alert(`${productName} تمت إضافته إلى السلة.`);
}
function scrollToOrderForm() {
   const orderFormSection = document.getElementById('order');
    if (orderFormSection) {
        orderFormSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error("'order' للأسف , نفذت الكمية");
    }
    closeCart()
}
// الحصول على سعر المنتج بناءً على معرف المنتج
function getProductPrice(productId) {
    const prices = {
        101: { name: "كوب فاخر", price: 5 },
        102: { name: "كوب كلاسيكي", price: 4 },
        103: { name: "كوب عصري", price: 4 },
        104: { name: "دفتر ملاحظات", price: 3 } // منتج جديد كمثال
    };
    return prices[productId] || { name: "غير معروف", price: 0 };
}

// حساب المجموع الإجمالي
function calculateTotal(includeDelivery = false, deliveryCost = 0) {
    const productsTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return includeDelivery ? productsTotal + deliveryCost : productsTotal;
}

// عرض السلة
function showCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartBackdrop = document.getElementById('cart-backdrop');
   
        cartModal.classList.add('visible');
        cartBackdrop.classList.add('visible');
    
        
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

function getDeliveryCost() {
    const deliverySelect = document.getElementById("delivery");
    const selectedOption = deliverySelect.options[deliverySelect.selectedIndex];
    return parseFloat(selectedOption.value) || 0;
}

// إغلاق السلة
function closeCart() {
  const cartModal = document.getElementById('cart-modal');
    const cartBackdrop = document.getElementById('cart-backdrop');
   
        cartModal.classList.remove('visible');
        cartBackdrop.classList.remove('visible');
}
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('visible'); // إضافة أو إزالة الصندوق عند النقر
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
        removeFromCart(index); // إزالة المنتج إذا كانت الكمية 1
    }
    showCart();
}

// حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    showCart();
}

  function updateDeliveryOptions() {
        const region = document.getElementById("region").value;
        const delivery = document.getElementById("delivery");

        delivery.innerHTML = ""; // تفريغ الخيارات السابقة

        if (region === "السعادة") {
            delivery.innerHTML = `<option value="مندوب - 1 ريال">مندوب - 1 ريال</option>`;
        } else if (region === "صلالة" || region === "عوقد" || region === "صحلنوت") {
            delivery.innerHTML = `<option value="مندوب - 1.5 ريال">مندوب - 1.5 ريال</option>`;
        } else if (region === "مسقط" || region === "اخرى") {
            delivery.innerHTML = `
                <option value="نقليات - 1 ريال">نقليات - 1 ريال</option>
                <option value="مندوب إلى الباب - 2 ريال">مندوب إلى الباب - 2 ريال</option>
            `;
        } else {
            delivery.innerHTML = `<option value="">اختر طريقة التوصيل</option>`;
        }
    }

// إرسال الطلب عبر واتساب
function sendWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const region = document.getElementById("region").value;
        const delivery = document.getElementById("delivery").value;
    const notes = document.getElementById('notes').value.trim();
    const deliveryCost = getDeliveryCost();
    const total = calculateTotal(includeDelivery, deliveryCost);
    if (!name || !address || !region || !delivery) {
        alert('يرجى ملء جميع الحقول المطلوبة!');
        return;
    }
    if (cart.length === 0) {
        alert('سلتك فارغة! يرجى إضافة منتجات.');
        return;
    }
    const deliveryCost = getDeliveryCost();
    const total = calculateTotal(includeDelivery, deliveryCost);
   
    const productsMessage = cart.map(item => `- ${item.name} (الكمية: ${item.quantity}, السعر الإجمالي: ${item.price * item.quantity} ريال)`).join('\n');
    const total = calculateTotal();
    const message = 
        `مرحبا، أريد تقديم طلب:\n` +
        `الاسم: ${name}\n` +
        `العنوان: ${address}\n` +
       `المنطقة: ${region} \n` +
`التوصيل: ${delivery}\n` +
        `المنتجات:\n${productsMessage}\n` +
        `المجموع: ${total} ريال\n` +
        `ملاحظات إضافية: ${notes || 'لا توجد ملاحظات'}\n`;

    const phone = '+96877267075'; // رقم الواتساب
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
