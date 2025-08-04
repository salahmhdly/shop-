// self هو المتغير الذي يشير إلى الـ Service Worker نفسه
self.addEventListener('install', (event) => {
  console.log('Service Worker: تم التثبيت');
  // تخطي مرحلة الانتظار وتفعيل الـ Service Worker الجديد فورًا
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: تم التفعيل');
  // جعل الـ Service Worker يتحكم في الصفحة فورًا
  event.waitUntil(clients.claim()); 
});

self.addEventListener('fetch', (event) => {
  // هذا سيتم استخدامه لاحقًا للتحكم في طلبات الشبكة إذا أردت
});

// ✅ --- هذا هو الكود المهم الذي يجب إضافته --- ✅
// هذا الكود يستمع للإشعارات القادمة من الخادم ويعرضها
self.addEventListener('push', (event) => {
  // استخراج البيانات من الإشعار. نفترض أنها بصيغة JSON.
  const data = event.data.json();
  console.log('Service Worker: تم استلام إشعار Push', data);

  const title = data.title || 'رسالة جديدة';
  const options = {
    body: data.body,
    icon: data.icon, // تأكد من أن مسار الأيقونة صحيح
    badge: '/icons/badge-72x72.png', // أيقونة صغيرة تظهر في شريط الإشعارات (اختياري)
    data: {
      url: data.data.url || '/' // الرابط الذي سيتم فتحه عند الضغط
    }
  };

  // عرض الإشعار للمستخدم
  event.waitUntil(self.registration.showNotification(title, options));
});

// ✅ --- وهذا الكود لفتح التطبيق عند الضغط على الإشعار --- ✅
self.addEventListener('notificationclick', (event) => {
  // إغلاق نافذة الإشعار
  event.notification.close();

  // فتح الرابط الموجود في بيانات الإشعار
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
