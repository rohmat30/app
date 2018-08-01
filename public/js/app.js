if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./js/service-worker.js')
        .then(function(){
            console.log('Service Worker Register');
        });
} else {
    console.log('Tidak Support Service Worker');
}