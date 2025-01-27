// متغير لتخزين تفاصيل السلة

    let cart = [];
 function openImage(src) {
            const overlay = document.getElementById('overlay');
            const largeImage = document.getElementById('largeImage');
            largeImage.src = src;
            overlay.style.display = 'flex';
        }

        function closeImage() {
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'none';
        }



const productsSection = document.querySelector('.products-section');
const howSection = document.querySelector('.how-to-order-section');
const orderSection = document.querySelector('.order-form-section');
const TwoPSection = document.querySelector('.two-products-section');
const ToPSection = document.querySelector('.top-product-section');
const LastSection = document.querySelector('.last-product');
// وظيفة لتفعيل الحركة عند ظهور القسم
function handleScroll() {
    const sectionPosition = productsSection.getBoundingClientRect().top; // 
     const sectionPosition1 = howSection.getBoundingClientRect().top;
       const sectionPosition2 = orderSection.getBoundingClientRect().top;
          const sectionPosition3 = TwoPSection.getBoundingClientRect().top;
      const sectionPosition4 = ToPSection.getBoundingClientRect().top;
       const sectionPosition5 = LastSection.getBoundingClientRect().top;
    const screenHeight = window.innerHeight; // ارتفاع الشاشة

    if (sectionPosition < screenHeight) {
        productsSection.classList.add('show'); // إضافة كلاس 'show' لتفعيل الحركة
    }
   if (sectionPosition1 < screenHeight)
        {
           howSection.classList.add('show');
        }
     if (sectionPosition2 < screenHeight)
        {
           orderSection.classList.add('show');
        }
   if (sectionPosition3 < screenHeight)
        {
           TwoPSection.classList.add('show');
        }
    if (sectionPosition4 < screenHeight)
        {
           ToPSection.classList.add('show');
        }
    if (sectionPosition5 < screenHeight)
        {
           LastSection.classList.add('show');
        }
}

// الاستماع لحدث التمرير
window.addEventListener('scroll', handleScroll);


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
    }, 1300); // تأخير بدء الانتقال
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
        title: `تمت الإضافة ! "${productName}" `,
    text: `صار بإمكانك ترسل طلبك او تضيف منتج ثاني لو تحب`,
        icon: 'success',
        confirmButtonText: 'تم'
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
        101: { name: "Lapis cup", price: 6.5 },
        102: { name: "Onyx cup", price: 6.5 },
        103: { name: "Ambra cup", price: 6.5 },
        104: { name: "Rosa cup", price: 6.5 },
        
        105: { name: "Topaz Brown cup", price: 4.5 },
        106: { name: "Yashma cup", price: 4.5 },
        
        107: { name: "Couco Pot", price: 3.5 },
        
        108: { name: "Azura cup", price: 5.5 },
        109: { name: "Creamy Pino cup", price: 5.5 }
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
         ‎ ${item.price} ‎ = ${item.name} ‎ ×  ‎  ${item.quantity}  ر.ع   ‎

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
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const region = document.getElementById("region").value;
    const delivery = document.getElementById("delivery").value;
    const notes = document.getElementById('notes').value.trim();
    const deliveryCost = getDeliveryCost();
    const includeDelivery = document.getElementById("includeDelivery").checked;

    // تحقق من المدخلات
    if (!name || !phone || !address || !region || !delivery) {
        Swal.fire({
            title: 'ملاحظة',
            text: 'يرجى تعبئة جميع المدخلات المطلوبة',
            icon: 'warning',
            confirmButtonText: 'حسنًا'
        });
        console.error("هناك مدخلات ناقصة:", { name, phone, address, region, delivery });
        return;
    }

    // تحقق من السلة
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
    const productsMessage = cart.map(item => `- ${item.name} (الكمية: ${item.quantity}, السعر : ${item.price * item.quantity} ريال عماني)`).join('\n');
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

    Swal.fire({
        title: 'شكراً لك',
        text: `سيتم توجيهك إلى الواتساب مع رسالة تتضمن ما طلبته، وسيتواصل معك فريقنا قريبًا لإرسال الفاتورة الخاصة بك لدفعها بإذن الله`,
        icon: 'info',
        confirmButtonText: 'تم'
    }).then((result) => {
        if (result.isConfirmed) {
            const phonew = '+96877267075';
            const whatsappUrl = `https://wa.me/${phonew}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank'); // فتح الرابط في نافذة جديدة
        }
    });
}

