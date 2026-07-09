var scrollEnable = false;
var iframeLoadedPage = document.getElementById('tangent_iframe_load_page');
if (iframeLoadedPage != undefined && iframeLoadedPage != null) {
  if (iframeLoadedPage.value != "true" && iframeLoadedPage.value != true){
    scrollEnable = true;
  }
}

disablePoweredByTangentForClients();

window.addEventListener('load', (event) => {
  // POST MESSAGE ON WINDOW ONLOAD
  setTimeout(function() {
    var iframe = document.getElementById("tangent-block-quiz-iframe");
    postMessageToIFrame(iframe);
  }, 3000);
});

var tangent_iframe = document.getElementById("tangent-block-quiz-iframe");
// POST MESSAGE ON IFRAME ONLOAD
tangent_iframe.addEventListener("load", function() {
  postMessageToIFrame(tangent_iframe);
});

function disablePoweredByTangentForClients() {
  
  var poweredByClientDisableList = ["1fd243-2.myshopify.com","the-sheika.myshopify.com","opalite.myshopify.com"];

  var tangent_search_results = document.getElementById("tangent-iframe-div").getElementsByTagName('p');
  var current_shop_domain = document.getElementById("tangent-shop-domain").innerHTML;
  if(poweredByClientDisableList.length>0 && poweredByClientDisableList.includes(current_shop_domain)){
    for (search_element of tangent_search_results) {
      search_element.style.cssText = "display:none!important";
    }
  }
}

function postMessageToIFrame(iframe){
  var iframe_window = iframe.contentWindow;

  // URL OF IFRAME LOAD CLIENT
  var url = window.location.href;

  // POST MESSAGE WITH URL
  var parent_url_params = encodeURIComponent(url);
  var parent_load_url = "tangent_client_url:"+parent_url_params;
  iframe_window.postMessage(parent_load_url, iframe.src);

  // POST MESSAGE WITH COOKIES
  var cookie_setting = "tangent_cookie:"+document.cookie;
  iframe_window.postMessage(cookie_setting, iframe.src);
}

function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener){
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Listen to message from child window
bindEvent(window, 'message', function (e) {
  var objState = isJsonString(e.data);
  if(objState){
    var obj = JSON.parse(e.data);
    if(obj.quiz_type=="inline"){
      // UPDATED SCROLL-TO & IFRAME HEIGHT_SETTER
      switch (obj.type){
        case 'page':
            if(obj.key == 'scrollTop'){
              if(scrollEnable){
                var element = document.getElementById('tangent-block-quiz-iframe');
                var headerOffset = 145;
                var elementPosition = element.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
              }
              else{
                scrollEnable = true;
              }
            }

            if(obj.key == 'iframe-height'){
                var height =  obj.value+ 150;
              
                var ex_height = document.getElementById("tangent-block-quiz-iframe").style.height;
                if(height != ex_height){
                  document.getElementById("tangent-block-quiz-iframe").setAttribute("style","min-height:"+ height+"px;width:100%;display:inline;");
                }
            }
          
          break;
        case 'number':
          var height =  e.data+ 150;
          var ex_height = document.getElementById("tangent-block-quiz-iframe").style.height;
          if(height != ex_height){
            document.getElementById("tangent-block-quiz-iframe").setAttribute("style","height:"+ height+"px;width:100%;display:inline;");
          }
          break;
        default:
          break;
      }
    }
  }
});