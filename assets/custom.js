/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */
 
// You're ${window.themeVariables.settings.freeGiftRemaining} away from a free gift.

// {% assign free_gift_threshold = settings.cart_free_gift_threshold | times: 100 %}
// {% assign remaining_amount = cart.total_price | minus: free_gift_threshold | abs | money_without_trailing_zeros %}
//       freeGiftRemaining: {{ remaining_amount | json }},



/*
 * ------------------------------------------------------------------------------------------------------------
 * CUSTOMIZATIONS
 * ------------------------------------------------------------------------------------------------------------
*/

// GLOBAL WINDOW VARIABLES
const pageType = window.themeVariables.settings.pageType;
var globalCartValue = (window.themeVariables.settings.cartValue/100).toFixed(2);
// console.log('globalcartvalue='+ globalCartValue);

// VARIABLES FOR FREE GIFTS DECLARED IN THEME SETTINGS

// free gift - GIFT 1 - adds per cart value defined in theme settings
const giftThreshold = window.themeVariables.settings.freeGiftThreshold;
const freeGiftProductId = window.themeVariables.settings.freeGiftProductId;
const freeGiftAvailability = window.themeVariables.settings.freeGiftAvailability;
// console.log(giftThreshold);

// free gift - GIFT 2 - adds per qualifying products defined in theme settings
const giftQualifier = window.themeVariables.settings.freeGiftQualifier;
const freeGiftProductIdTwo = window.themeVariables.settings.freeGiftProductIdTwo;
const freeGiftAvailabilityTwo = window.themeVariables.settings.freeGiftAvailabilityTwo;
// console.log(giftQualifier);

// free gift chooser module (high value)
const freeGiftChooserThreshold = window.themeVariables.settings.freeGiftChooserThreshold;


// check to see if free gift should be added - on cart page
if (pageType=="cart"){
    // runs on initial cart page load. changes to cart trigger a page refresh, not the cart updated event
    checkForFreeGift(window.themeVariables.settings.cartValue, window.themeVariables.settings.cartItems, window.themeVariables.settings.cartCount );
    console.log("cart page!");
}


// ------------------------------------------------------------------------------------------------------------------
// CART UPDATED EVENT LISTENER
// ------------------------------------------------------------------------------------------------------------------

document.addEventListener('cart:updated', function(event) {
    console.log('cart updated');
    checkForFreeGift(event.detail.cart.total_price, event.detail.cart.items, event.detail.cart.item_count);
    globalCartValue = (event.detail.cart.total_price/100).toFixed(2);
});

function checkForFreeGift(cartTotalPrice, cartItems, cartCount){
    // console.log(cart);
    // console.log("check for free gift");

    // cart variables
    // let cartTotalPrice = cart.total_price;
    // let cartCount = cart.item_count;
    // let cartItems = cart.items;

    let cartValue = (cartTotalPrice/100);
    let remainingAmount  = giftThreshold - cartValue;

    let freeGiftChooserExists = document.querySelector('.mini-cart__free-gift-chooser');

    // if something is removed and it's a gwp, don't add it again
    let gwpRemoved = sessionStorage.getItem("gwpRemoved");

   
    // check if free gift is already in cart
    var freeGiftinCart = freeGiftInCart(freeGiftProductId, cartItems);
    var freeGiftinCartTwo = freeGiftInCart(freeGiftProductIdTwo, cartItems);

    // change free gift messaging
    changeFreeGiftMessage(cartValue, giftThreshold, remainingAmount);

    // TODO: if running these two functions simultaneously sometimes the cart refresh on successful ajax add to cart prevents one from being auto-loaded

    // check to see if they qualify for free product 1 - based on cart value
    if (hasQualifyingCart(cartValue, giftThreshold)){
        if (freeGiftinCart == false && freeGiftAvailability == true && gwpRemoved != "true"){
            // console.log('adding the free gift - cart qualifies');
            addItemToCart(freeGiftProductId);
        }
        else{
            // console.log('not adding the free gift based on cart value');
        }
    }

    // check to see if they qualify for free product 2 - based on qualifying product
    if (hasQualifyingProduct()){
        console.log(freeGiftinCartTwo);
        if (freeGiftinCartTwo == false && freeGiftAvailabilityTwo == true && gwpRemoved != "true"){
            // console.log('adding the free gift - product qualifies');
            addItemToCart(freeGiftProductIdTwo);
        }
        else{
            // console.log('not adding the free gift based on qualifying product');
        }
    }

    // show the free gift chooser module if it's set to display in cart drawer and if reached qualifying theshold
    if (cartValue >= freeGiftChooserThreshold){
        if (freeGiftChooserExists){
            document.querySelector('.mini-cart__free-gift-chooser').style.display = "block";
        }
    }

    // refresh cart count in case there is a donation product in cart
    refreshCartCount(cartCount, cartItems);
}


// REFRESH THE NUMBER OF ITEMS IN THE CART TO EXCLUDE ANY DONATION PRODUCTS
function refreshCartCount(itemCount, cartItems){
    let newCartCount = itemCount;
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].product_type == "Donation"){
        newCartCount -= cartItems[i].quantity;
        document.querySelector('cart-count').innerText = newCartCount;
      }
    }
}

// CHECK TO SEE IF FREE GIFT IS ALREADY IN CART
function freeGiftInCart(productId, cartItems) {
    let freeGiftStatus = false;
    cartItems.forEach(function(item){
        if (item.variant_id == productId) {
            // console.log('free gift found in cart');
            freeGiftStatus = true;
        }
    });        
    return freeGiftStatus;
};

// CHECK TO SEE IF CART VALUE HAS REACHED FREE GIFT THRESHOLD
function hasQualifyingCart(cartValue, giftThreshold){
    let cartQualifies;
    if (cartValue < giftThreshold){
        cartQualifies = false;
    }
    else if (cartValue >= giftThreshold){
        cartQualifies = true;    
    }
    return cartQualifies;
}

// CHECK TO SEE IF QUALIFYING PRODUCT IS IN CART - by - can't get tag in line_item though
function hasQualifyingProduct(){
    let cartQualifies;
    if (pageType =="cart"){
        if (document.querySelector('.cart__content').hasAttribute("data-qualifying-product")) {
            cartQualifies = true;
        }
        else{
            cartQualifies = false;
        }   
    }
    else{
        if (document.querySelector('#mini-cart-drawer__header').hasAttribute("data-qualifying-product")) {
            cartQualifies = true;
        }
        else{
            cartQualifies = false;
        }   
    }
    return cartQualifies;
}

// CHANGE FREE GIFT MESSAGE IN CART NOTIFICATION BARS
function changeFreeGiftMessage(cartValue, giftThreshold, remainingAmount){
    // WHEN PRODUCT IS ADDED TO CART FROM QUICK ADD TO CART (MINI CART NOTIFICATION IS IN MINI-CART.LIQUID)
    let notificationBarExists = document.getElementById("cart-notification__free-gift");
    if (cartValue < giftThreshold){
        if (notificationBarExists){
            document.getElementById('cart-notification__free-gift').innerHTML += "You're $" + remainingAmount.toFixed(2) + " away from a free gift."; 
        }
    }
    else if (cartValue >= giftThreshold){
        if (notificationBarExists){
            // document.getElementById('cart-notification__free-gift').style.display = 'none';
            document.getElementById('cart-notification__free-gift').innerHTML += "You've got a free gift!&nbsp; <i class='fas fa-gift'></i>";
        }        
    }
}


// ------------------------------------------------------------------------------------------------------------------
// AJAX ADD TO CART
// ------------------------------------------------------------------------------------------------------------------


function addItemToCart(item){
    console.log("***** adding to cart ***** " + item);
    // this takes variant.id - quantity is the amount of the variant that you want to add and id is the variant ID of that variant
    // if you ever get a 422 error here it's likely because the product is out of stock
    $.ajax({
        type: "POST",
        url: "/cart/add.js",
        data: {
            items: [
                {
                    quantity: 1,
                    id: item
                }
              ]
        },
        dataType: "json",
        success: function (success) {
            // if on cart page, refresh page
            if (pageType == "cart"){
                location.reload();
            }
            // if not on cart page, cart refresh event
            else{
                document.getElementById('mini-cart').open = true;
                document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
            }
            console.log('success!!!');
        },
        error: function(error){
            // console.log("add to cart error");
        }
    });
    // ================================================
}


// ------------------------------------------------------------------------------------------------------------------
// VARIANT CHANGED EVENT LISTENER
// ------------------------------------------------------------------------------------------------------------------


// LOYALTY POINTS NOTIFICATION ON PDP + INSTALLMENTS CALCULATION ON PDP
document.addEventListener('variant:changed', function(event) {
    let variant = event.detail.variant;

    if (pageType == "product"){
        var installmentsContainer = document.querySelector('.js-installments-price');
        var variantPrice = (variant.price / 100 );
        var installment = (variantPrice / 4 ).toFixed(2);
        console.log(installment);
        installmentsContainer.innerHTML = "$" + installment;
        // refresh loyalty lion elements
        refreshLoyaltyPoints(variantPrice);
    }
});

function refreshLoyaltyPoints(variantPrice){
    // console.log(variantPrice);
    let newPrice = variantPrice * 100;
    document.getElementById('LLPointsForPurchase-PDP').setAttribute('data-lion-points-for', newPrice);
    // now that we've updated the element, we tell the sdk to refresh
    window.loyaltylion && window.loyaltylion.ui.refresh()
}

// https://developers.loyaltylion.com/sdk/live-updating/


// ------------------------------------------------------------------------------------------------------------------
// MISCELLANEOUS EVENT LISTENERS
// ------------------------------------------------------------------------------------------------------------------

// OBS Popup
$('body').on('click', '.obs-symbol', function(e) {
    document.getElementById('eu-popup').open = true;
});   

// when gwp item is removed from cart
$('body').on('click', '.line-item__remove-button', function(e) {
    // if it's a gwp product that was removed
    if ( e.currentTarget.hasAttribute("data-is-gwp")) {
        // console.log('removed a gwp item');
        sessionStorage.setItem("gwpRemoved", "true");
    }
});   


// ------------------------------------------------------------------------------------------------------------------
// VARIANT ADDED EVENT LISTENER
// ------------------------------------------------------------------------------------------------------------------

// document.addEventListener('variant:added', function(event) {
//     // console.log('variant added to cart');
// });


// ------------------------------------------------------------------------------------------------------------------
// ATTENTIVE SMS SUBSCRIBERS - FOOTER
// ------------------------------------------------------------------------------------------------------------------

$('body').on('click', '#sms_signup .Form__Submit', function(e) {
   // console.log('sms clicked');

    e.preventDefault();
    
    var phoneNumber = $('#sms_signup .input__field').val();

    // validate phone number
    var phone_pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var valid_phone = phone_pattern.test(phoneNumber);

    if (valid_phone){
        // build data object
        var data = {
            user: {
                "user": {
                    "phone": "+1" + String(phoneNumber)
                },
                "signUpSourceId": "105436"
            }
        }
        //clear field
        $('#sms_signup .input__field').val('');
        // console.log("send number to middleware");
        // console.log(JSON.stringify(data.user));
        $.ajax({
                //dev url - changes when you relaunch ngrok
            // url: "http://df7033e96033.ngrok.io/attentive-subscriber", 
            url: "https://pb-middleware.herokuapp.com/attentive-subscriber",
            method: "POST",
            // dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (data) {
                $('#sms_signup').hide();
                            $('.SMS_Content').hide();
                            $('.sms_success').show();
                // console.log("data="+JSON.stringify(data));
                // console.log("SUCCCESS!");
            },
            error: function(xhr, status, error) {
              var err = eval("(" + xhr.responseText + ")");
              console.log("error attentive");
              // console.log(err.Message);
            }
        });
    }
    else {
        // console.log("no number!");
        $('#sms_signup .input__field').val("Please enter a valid phone number");
        $('#sms_error').show();
    }

});   




// ------------------------------------------------------------------------------------------------------------------
// DONATION MODULE IN MINI CART
// ------------------------------------------------------------------------------------------------------------------

// var donationId = $("#ProductSelect-donation").children("option:selected").val();

$('body').on('click', '#donateButton', function(e) {
    e.preventDefault();
    // console.log(donationId);
    var donationId = $("#ProductSelect-donationID").val();
    var donationQty = $("#ProductSelect-donationID").attr("data-round-up");
    // 
    addDonationToCart(donationId, donationQty);
});

$(document).ready(function(){
    $(document).on('change', '#ProductSelect-donation', function() { 
        var selectedAmount = $(this).children("option:selected").val();
        donationId = $(this).children("option:selected").val();
    });
});
    


function addDonationToCart(item, qty){
    $.ajax({
        type: "POST",
        url: "/cart/add.js",
        data: {
            items: [
                {
                    quantity: qty,
                    id: item
                }
              ]
        },
        dataType: "json",
        success: function (success) {
            document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
            // hide donate module after
            document.getElementById("donation_module").style.display = "none";
        },
        error: function(error){
            console.log("add to cart error");
        }
    });
}




// ORDERGROOVE CART REFRESH
// Hooks OG cart updated to cart refresh
document.addEventListener('og-cart-updated', ev => {      
    // console.log("update cart OG!");        
    document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
        bubbles: true
    }));
    // ev.preventDefault();
});



// GA4 - using Shopify integration so can eventually delete 

// GA4 begin checkout
// function trackGA4IC(){
//     // console.log("running begin_checkout GA4 code from custom JS " + globalCartValue);
//     dataLayer.push({ 'ecommerce': null });
//     dataLayer.push({
//         event: 'begin_checkout',
//         ecommerce: {
//             'currency': 'USD',
//             'value': globalCartValue  
//         }
//     });
// }   

// GA4 add to cart
// function trackGQ4ATC(event){
//     // console.log("running add_to_cart GA4 code");
//     // console.log(event);
//     var variantID = event.detail.variant.id;
//     var variantTitle = event.detail.variant.title;
//     var variantBrand = event.detail.variant.vendor;
//     var variantType = event.detail.variant.product_type;
//     var variantSKU = event.detail.variant.sku;
//     var variantPrice = (event.detail.variant.price/100).toFixed(2);
//     dataLayer.push({ 'ecommerce': null });
//     dataLayer.push({
//         event: 'add_to_cart',
//         ecommerce: {
//             'items': [{
//                 'item_id': variantID,
//                 'item_name': variantTitle,
//                 'item_brand': variantBrand,
//                 'item_category': variantType,
//                 'item_variant': variantSKU,
//                 'currency': 'USD',
//                 'price': variantPrice
//             }]
//         }
//     });          
// }



