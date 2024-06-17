let a = document.createElement('script');
a.type = 'text/javascript';
a.async = true;
a.src = 'http://localhost:8085/embed'
    + '?service=heatmap-popup&tokenId='
    + "281543725"
    + '&protocol=' + window.location.protocol
    + '&hostname=' + window.location.hostname
    + '&pathname=' + encodeURIComponent(window.location.pathname)
    + '&search=' + encodeURIComponent(window.location.search)
    + '&hash=' + encodeURIComponent(window.location.hash)
    + '&dv=' + "d";
let b = document.getElementsByTagName('script')[0];
b.parentNode.insertBefore(a, b);