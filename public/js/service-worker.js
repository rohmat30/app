self.addEventListener('install',function(event){
    event.waitUntil(
      caches.open('ewarga').then(function(cache){
        return cache.addAll([
            '/favicon.ico',
            '/logo.png',
            '/js/jquery.min.js',
            '/js/bootstrap.bundle.min.js',
            '/js/menuAccordion.js',
            '/js/Chart.min.js',
            '/js/autocomplate.js',
            '/js/app.js',
            '/css/bootstrap.min.css',
            '/css/metro-icons.min.css',
            '/css/costum/exr.css',
            '/fonts/mif/metro.json',
            '/fonts/mif/metro.svg',
            '/fonts/mif/metro.ttf',
            '/fonts/mif/metro.woff',
            '/fonts/fontawesome-webfont.eot',
            '/fonts/fontawesome-webfont.svg',
            '/fonts/fontawesome-webfont.ttf',
            '/fonts/fontawesome-webfont.woff',
            '/fonts/fontawesome-webfont.woff2',
            '/fonts/FontAwesome.otf'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch',function(event){
    event.responseWith(
      caches.match(event.request).then(function(response){
        if(response !== undefined) {
          return response;
        } else {
          return fetch(event.request),then(function(response){
            let responseClone = response.clone();
            caches.open('ewarga').then(function(cache){
              cache.put(event.request,responseClone);
            });
            return response;
          }).catch(function(){
            return caches.match('/js/app.js');
          });
        }
      })
    );
  });