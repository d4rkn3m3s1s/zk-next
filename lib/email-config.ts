// Email configuration (shared between client and server)
export const statusMessages: Record<string, { subject: string; title: string; message: string; color: string }> = {
    received: {
        subject: 'Cihazınız Teslim Alındı',
        title: '✅ Cihaz Teslim Alındı',
        message: 'Cihazınız servisimize başarıyla teslim edildi. Arıza tespiti için teknisyenlerimiz incelemeye başladı.',
        color: '#3b82f6'
    },
    diagnosing: {
        subject: 'Arıza Tespiti Yapılıyor',
        title: '🔍 Arıza Tespiti',
        message: 'Teknisyenlerimiz cihazınızın arıza tespitini yapıyor. Kısa süre içinde size fiyat teklifi sunulacaktır.',
        color: '#8b5cf6'
    },
    price_pending: {
        subject: 'Fiyat Onayınız Bekleniyor',
        title: '💰 Fiyat Onayı Gerekli',
        message: 'Arıza tespiti tamamlandı. Onarım için belirlenen ücreti onaylamanız gerekmektedir. Takip sayfanızdan onaylayabilirsiniz.',
        color: '#f59e0b'
    },
    parts_ordered: {
        subject: 'Yedek Parça Bekleniyor',
        title: '📦 Parça Siparişi',
        message: 'Onarım için gerekli yedek parçalar sipariş edildi. Parçalar geldiğinde işleme devam edilecektir.',
        color: '#6366f1'
    },
    in_progress: {
        subject: 'Onarım İşlemi Başladı',
        title: '🔧 Onarım Sürüyor',
        message: 'Cihazınızın onarımı başladı. Teknisyenlerimiz üzerinde çalışıyor.',
        color: '#0ea5e9'
    },
    testing: {
        subject: 'Test Aşamasında',
        title: '⚡ Test Ediliyor',
        message: 'Onarım tamamlandı ve cihazınız test aşamasında. Tüm fonksiyonlar kontrol ediliyor.',
        color: '#14b8a6'
    },
    completed: {
        subject: 'Onarım Tamamlandı!',
        title: '🎉 İşlem Tamamlandı',
        message: 'Cihazınızın onarımı başarıyla tamamlandı. Teslim almak için iletişime geçebilirsiniz.',
        color: '#10b981'
    },
    delivered: {
        subject: 'Cihaz Teslim Edildi',
        title: '✨ Teslim Edildi',
        message: 'Cihazınız tarafınıza teslim edilmiştir. Hizmetimizden memnun kaldıysanız bizi tavsiye etmeyi unutmayın!',
        color: '#22c55e'
    },
    cancelled: {
        subject: 'İşlem İptal Edildi',
        title: '❌ İptal / İade',
        message: 'Onarım işlemi iptal edildi. Cihazınızı teslim almak için iletişime geçebilirsiniz.',
        color: '#ef4444'
    }
}
