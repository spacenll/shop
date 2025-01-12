// متغير لتخزين تفاصيل السلة
let cart = [];

// إضافة المنتج إلى السلة
function addToCart(productId, productName) {
    // التحقق إذا كان المنتج مضافًا بالفعل
    const productExists = cart.find(item => item.id === productId);

    if (!productExists) {
        cart.push({ id: productId, name: productName });
        alert(`${productName} تمت إضافته إلى السلة.`);
    } else {
        alert(`${productName} موجود بالفعل في السلة.`);
    }
}

// إرسال الطلب عبر واتساب
function sendWhatsApp() {
    // استدعاء قيم الحقول
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;

    // التحقق من الحقول المطلوبة
    if (!name || !address || cart.length === 0) {
        alert('يرجى ملء جميع الحقول المطلوبة وإضافة منتج إلى السلة!');
        return;
    }

    // إنشاء نص المنتجات المضافة للسلة
    const productsMessage = cart.map(item => `- ${item.name} (رقم التعريف: ${item.id})`).join('\n');

    // نص الرسالة
    const message = 
        `مرحبا، أريد تقديم طلب:\n` +
        `الاسم: ${name}\n` +
        `العنوان: ${address}\n` +
        `المنتجات:\n${productsMessage}\n` +
        `ملاحظات إضافية: ${notes || 'لا توجد ملاحظات'}\n`;

    // رقم الهاتف
    const phone = '+96877267075';

    // رابط واتساب
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // فتح الرابط في نافذة جديدة
    window.open(whatsappUrl, '_blank');
}
