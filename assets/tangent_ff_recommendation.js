/* RECOMMENDATION PAGE SCRIPT */

var domainUrl = document.getElementById("site-url").innerText;

// Custom CSS from Customise Template Section
var cCode;
var custom_code_ele = document.getElementById("custom-css-code");
if(custom_code_ele!=null && custom_code_ele!=undefined){
    if(custom_code_ele.innerHTML!=""){
        cCode = custom_code_ele.innerHTML;
    }
}

window.onload = function() {
    domainUrl = document.getElementById("site-url").innerText;
  console.log("Tangent script");
    if (window.jQuery) {
        // console.log("jquery present");
    } else {
        // ADDING JQUERY
        addExternalScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js")         
    }

    // ADDING SHOPIFY API JQUERY JS 
    addExternalScript("https://cdn.shopify.com/s/shopify/api.jquery.js")

    // ADDING CUSTOM CSS CODE THROUGH CUSTOMISE SECTION ON EXTENSION
    addCssFromTemplateCustomise();
    
}

// Setting count for add all to cart products
var addToCartCount;

var addAllToCartLink;
var url_string = window.location.href;
var url = new URL(url_string);
var products;
let selected_pdt;
var imgid = url.searchParams.get("id");
var resp_id = url.searchParams.get("resp_id");
var active_product_count;
var language_isocode = document.getElementById("site-iso-code").innerText;
var default_addToCartText = "Add to bag";
var default_addedToCartText = "Added to bag!";
let outOfStock = "Out of Stock";
// Choosing language code from store
switch (language_isocode) {
    case "es":
        // Spanish
        default_addToCartText = "Añadir a la cesta";
        default_addedToCartText = "¡Añadido al carrito!";
        outOfStock = "Agotado";
        break;
    case "it":
        // Italian
        default_addToCartText = "Aggiungi al carrello";
        default_addedToCartText = "Aggiunto al carrello!";
        outOfStock = "esaurito";
        break;
    case "fr":
        // French
        default_addToCartText = "Ajouter au panier";
        default_addedToCartText = "Ajouté au panier!";
        outOfStock = "rupture de stock";
        break;
    case "de":
        // German
        default_addToCartText = "In den Warenkorb legen";
        default_addedToCartText = "Zum Warenkorb hinzugefügt!";
        outOfStock = "ausverkauft";
        break;
    case "ja":
        // Japanese
        default_addToCartText = "カートに追加";
        default_addedToCartText = "カートに追加されました!";
        outOfStock = "在庫切れ";
        break;
    case "ko":
        // Korean
        default_addToCartText = "카트에 추가하십시오";
        default_addedToCartText = "장바구니에 담았습니다!";
        outOfStock = "품절";
        break;
    case "pl":
        // Polish
        default_addToCartText = "Dodaj do koszyka";
        default_addedToCartText = "Dodano do koszyka!";
        outOfStock = "obecnie brak na stanie";
        break;
    case "pt":
        // Portuguese
        default_addToCartText = "Adicionar ao carrinho";
        default_addedToCartText = "Adicionado ao carrinho!";
        outOfStock = "fora de estoque";
        break;
    case "pt-BR":
        // Portuguese
        default_addToCartText = "Adicionar ao carrinho";
        default_addedToCartText = "Adicionado ao carrinho!";
        outOfStock = "fora de estoque";
        break;
    case "ru":
        // Russian
        default_addToCartText = "Добавить в корзину";
        default_addedToCartText = "Добавлено в корзину!";
        outOfStock = "распродано";
        break;
    case "sl-SI":
        // Slovenian
        default_addToCartText = "Dodaj v košarico";
        default_addedToCartText = "Dodaj vse v košarico";
        outOfStock = "Ni na zalogi";
        break;
    case "da":
        // Danish
        default_addToCartText = "Tilføj til kurv";
        default_addedToCartText = "Tilføjet til indkøbskurv";
        outOfStock = "Udsolgt";
        break;
    case "fi":
        // Finnish
        default_addToCartText = "Lisää ostoskoriin";
        default_addedToCartText = "Lisätty ostoskoriin";
        outOfStock = "Loppu varastosta";
        break;
    default:
        // English by Default
        default_addToCartText = "Add to bag";
        default_addedToCartText = "Added to bag";
        outOfStock = "Out of Stock";
}

var domainCurrency;

// Default url path for product
var variant_product_url;

var product_options_map = {};

var option1array = [];
var option2array = [];
var option3array = [];

var variantOption1_div;
var variantOption2_div;
var variantOption3_div;

// Options name mapped to variant id
var option2_variant_map = {};

if (resp_id != null) {

    var checkout_url = "https://service.tangent.ai/shopify/get-checkout-products?resp_id=" + resp_id + "&self_serve=true" + "&multiple_variants=true";
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        var DONE =  (typeof XMLHttpRequest.DONE !== 'undefined') ? XMLHttpRequest.DONE : 4;
        if (xmlhttp.readyState == DONE) { // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                var jsonData = JSON.parse(xmlhttp.responseText);
                document.getElementById('tangent-selfie-container-div').innerHTML = jsonData.selfie_html;
                products = jsonData.products;
                domainCurrency = document.getElementById("site-currency").innerText;

                var allToCart = domainUrl + "/cart/add?id[]=";

                if (products.length > 0) {

                    document.getElementById('tangent-add-all-to-cart').style.display = "block";

                    selected_pdt = {};
                    active_product_count = 0;
                    var select_variant_obj;
                    
                    for (var p = 0; p < products.length; p++) {
                        select_variant_obj = products[p].variants[0];
                        option1array = [];
                        option2array = [];
                        option3array = [];
                        variant_product_url = domainUrl + '/products/';
                        var variant_price;

                        var imgsrc = "";
                        if (domainCurrency == "") {
                            domainCurrency = '$';
                        }
                        if (products[p].images != undefined) {
                            imgsrc = getVariantImage(products[p].variants[0].image_id,products[p]);
                        }
                        else{
                            imgsrc = "https://file.tangent.ai/quiz-content/merchants/nitesh-dev-store/image/5009378275701413-no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c_720x.webp";
                        }

                        variantOption1_div = document.createElement("div");
                        variantOption1_div.classList.add("tangent_option_div");

                        variantOption2_div = document.createElement("div");
                        variantOption2_div.classList.add("tangent_option_div");

                        variantOption3_div = document.createElement("div");
                        variantOption3_div.classList.add("tangent_option_div");

                        var variant_checkbox_elm = document.getElementById('tangent_variant_view_check');

                        variant_price = products[p].variants[0].price;
                        variant_product_url = variant_product_url + products[p].handle + "?variant=" + products[p].variants[0].id;

                        let selectedVariant = isSelectedVariantPresent(jsonData.selected_variants, products[p].id)

                        // CHECK FOR VARIANT ENABLED
                        if (!selectedVariant.length && products[p].variants.length > 1) {
                            if (variant_checkbox_elm != undefined && variant_checkbox_elm != null) {
                                if (variant_checkbox_elm.value==true || variant_checkbox_elm.value=="true") {

                                    var variants_div = document.createElement("div");
                                    variants_div.id = 'tangent_checkout_variants_div_' + p;
                                    variants_div.classList.add("tangent_checkout_variants_div");
                                    variants_div.style.display = "none";

                                    var variantsub_div = document.createElement("div");
                                    variants_div.appendChild(variantsub_div);
                                    var _variants = products[p].variants;
                                    var option1_ele_arr = [];
                                    var option2_ele_arr = [];
                                    var option3_ele_arr = [];

                                    var option_obj = {};

                                    variants_div.style.display = "block";

                                    // Product Option 1 Name Element
                                    var option1_name = document.createElement("p");
                                    option1_name.id = "optionName_variant:product_" + p;
                                    option1_name.innerText = products[p].options[0].name + ":";
                                    option1_name.classList.add("tangent_option_name");
                                    variantOption1_div.append(option1_name);

                                    // Creating values for product option 1 
                                    var option1_values = products[p].options[0].values;
                                    for (var opt1v = 0; opt1v < option1_values.length; opt1v++) {
                                        var variants_option1 = document.createElement("p");
                                        variants_option1.id = "product_" + p + ":option_" + opt1v;
                                        variants_option1.title = option1_values[opt1v];
                                        variants_option1.innerText = option1_values[opt1v];
                                        variants_option1.classList.add("tangent_option");
                                        variants_option1.classList.add("product_" + p + "v1");
                                        variants_option1.classList.add("tangent_options_1");

                                        if (!option1array.includes(option1_values[opt1v])) {
                                            option1array.push(option1_values[opt1v]);
                                            option1_ele_arr.push(variants_option1);
                                            variantOption1_div.appendChild(variants_option1);
                                        }
                                    }
                                    if (option1_ele_arr.length > 0) { option_obj["option1"] = option1_ele_arr; }

                                    // Product Option 2 Name Element
                                    if (products[p].options.length > 1) {
                                        var option2_name = document.createElement("p");
                                        option2_name.id = "optionName_variant:product_" + p;
                                        option2_name.innerText = products[p].options[1].name + ":";
                                        option2_name.classList.add("tangent_option_name");
                                        variantOption2_div.append(option2_name);
                                    }

                                    // Creating values for product option 2
                                    if (products[p].options[1] != undefined) {
                                        var option2_values = products[p].options[1].values;
                                        for (var opt2v = 0; opt2v < option2_values.length; opt2v++) {
                                            var variants_option2 = document.createElement("p");
                                            variants_option2.id = "product_" + p + ":option_" + opt2v;
                                            variants_option2.title = option2_values[opt2v];
                                            variants_option2.innerText = option2_values[opt2v];
                                            variants_option2.classList.add("tangent_option");
                                            variants_option2.classList.add("product_" + p + "v2");
                                            variants_option2.classList.add("tangent_options_2");

                                            if (!option2array.includes(option2_values[opt2v])) {
                                                option2array.push(option2_values[opt2v]);
                                                option2_ele_arr.push(variants_option2);
                                                variantOption2_div.appendChild(variants_option2);
                                            }
                                        }
                                    }
                                    if (option2_ele_arr.length) { option_obj["option2"] = option2_ele_arr; }

                                    // Product Option 3 Name Element
                                    if (products[p].options.length > 2) {
                                        var option3_name = document.createElement("p");
                                        option3_name.id = "optionName_variant:product_" + p;
                                        option3_name.innerText = products[p].options[2].name + ":";
                                        option3_name.classList.add("tangent_option_name");
                                        variantOption3_div.append(option3_name);
                                    }

                                    // Creating values for product option 3
                                    if (products[p].options[2] != undefined) {
                                        var option3_values = products[p].options[2].values;
                                        for (var opt3v = 0; opt3v < option3_values.length; opt3v++) {
                                            var variants_option3 = document.createElement("p");
                                            variants_option3.id = "product_" + p + ":option_" + opt3v;
                                            variants_option3.title = option3_values[opt3v];
                                            variants_option3.innerText = option3_values[opt3v];
                                            variants_option3.classList.add("tangent_option");
                                            variants_option3.classList.add("product_" + p + "v3");
                                            variants_option3.classList.add("tangent_options_3");

                                            if (!option3array.includes(option3_values[opt3v])) {
                                                option3array.push(option3_values[opt3v]);
                                                option3_ele_arr.push(variants_option3);
                                                variantOption3_div.appendChild(variants_option3);
                                            }
                                        }
                                    }
                                    if (option3_ele_arr.length > 0) { option_obj["option3"] = option3_ele_arr; }

                                    product_options_map[products[p].id] = option_obj;

                                    var option2_var = {};

                                    // All options for the product
                                    var options1;
                                    var options2;
                                    var options3;

                                    for (var v = 0; v < _variants.length; v++) {

                                        var optVariant;
                                        if (_variants[v].option1 != null) {
                                            optVariant = _variants[v].option1
                                        }
                                        if (_variants[v].option2 != null) {
                                            optVariant = optVariant + "_" + _variants[v].option2
                                        }
                                        if (_variants[v].option3 != null) {
                                            optVariant = optVariant + "_" + _variants[v].option3
                                        }

                                        option2_var[optVariant] = _variants[v];
                                        option2_variant_map[products[p].id] = option2_var;
                                    }

                                    // When product has no variant previously selected
                                    // Default Select Option 1
                                    if (product_options_map[products[p].id].option1 != undefined) {
                                        if (product_options_map[products[p].id].option1.length > 0) {
                                            options1 = product_options_map[products[p].id].option1;
                                            options1[0].classList.add("tangent_selected-variant");
                                        }
                                    }

                                    // Default Select Option 2
                                    if (product_options_map[products[p].id].option2 != undefined) {
                                        if (product_options_map[products[p].id].option2.length > 0) {
                                            options2 = product_options_map[products[p].id].option2;
                                            options2[0].classList.add("tangent_selected-variant");
                                        }
                                    }

                                    // Default Select Option 3
                                    if (product_options_map[products[p].id].option3 != undefined) {
                                        if (product_options_map[products[p].id].option3.length > 0) {
                                            options3 = product_options_map[products[p].id].option3;
                                            options3[0].classList.add("tangent_selected-variant");
                                        }
                                    }

                                    selected_pdt[products[p].id] = _variants[0].id + "";
                                    select_variant_obj = _variants[0];

                                    variant_price = _variants[0].price;
                                    variant_product_url = variant_product_url + products[p].handle + "?variant=" + _variants[0].id;

                                    variantsub_div.appendChild(variantOption1_div);
                                    variantsub_div.appendChild(variantOption2_div);
                                    variantsub_div.appendChild(variantOption3_div);

                                }
                            }
                        }
                        if (selected_pdt[products[p].id] == null) {
                            selected_pdt[products[p].id] = products[p].variants[0].id;
                        }
                        if (!selectedVariant.length && (products[p].variants.length > 1 || products[p].variants.length == 1)) {
                            var product_html;
                            if(domainUrl==undefined){
                                domainUrl = document.getElementById("site-url").innerText;
                            }
                            
                            product_html = '<div><a id="url_tangent_product_' + p + '" class="tangent-text-link" target="_blank" href="' + variant_product_url + '"><img id="image_tangent_product_' + p + '" src="' + imgsrc + '" class="tangent_product_image"><p class="tangent-product-title tangent_product_title_text"><b>' + products[p].title + '</b></p><p id="price_tangent_product_' + p + '" class="tangent_product_price_text">' + domainCurrency + variant_price + '</p></a><div id="tangent_product_' + p + '"></div><a class="tangent-product-add-btn-wrapper" id="cart_tangent_product_' + p + '" onclick="addToCart('+selected_pdt[products[p].id]+','+p+')" href="javascript: void(0)"><p class="tangent-btn-add tangent_add_to_cart_button" id="cart_tangent_product_' + p + '_text">' + default_addToCartText + '</p></a>';
                            
                            var element = document.getElementById('tangent-products-section');
                            element.innerHTML = element.innerHTML + product_html;
                            if (!selectedVariant.length && products[p].variants.length > 1) {
                                if (variant_checkbox_elm != undefined && variant_checkbox_elm != null) {
                                    if (variant_checkbox_elm.value==true || variant_checkbox_elm.value=="true") {
                                        var variant_element = document.getElementById('tangent_product_' + p);
                                        variant_element.appendChild(variants_div);
                                    }
                                }
                            }
                            var cart_button = document.getElementById("cart_tangent_product_" + p);
                            var cart_button_text = document.getElementById("cart_tangent_product_" + p + "_text");
                            if(cart_button!=undefined){
                                // Check if Product is active
                                if (products[p].status == "active") {
                                    cart_button.classList.remove("disable-btn-wrapper");
                                    if(select_variant_obj.inventory_policy == "deny"){
                                        if(select_variant_obj.inventory_quantity<1){
                                        if(select_variant_obj.inventory_management!=null){
                                            cart_button_text.innerHTML = outOfStock;
                                            cart_button.classList.add("disable-btn-wrapper");
                                        }
                                        else{
                                            if (active_product_count == 0) {
                                                allToCart += selected_pdt[products[p].id];
                                            } else {
                                                allToCart += "&id[]=" + selected_pdt[products[p].id];
                                            }
                                            active_product_count++;
                                            // updateAddAllToCartLink(selected_pdt[products[p].id]);
                                        }
                                        }
                                        else{
                                            if (active_product_count == 0) {
                                                allToCart += selected_pdt[products[p].id];
                                            } else {
                                                allToCart += "&id[]=" + selected_pdt[products[p].id];
                                            }
                                            active_product_count++;
                                            // updateAddAllToCartLink(selected_pdt[products[p].id]);
                                        }
                                    }
                                    else{
                                        if (active_product_count == 0) {
                                            allToCart += selected_pdt[products[p].id];
                                        } else {
                                            allToCart += "&id[]=" + selected_pdt[products[p].id];
                                        }
                                        active_product_count++;
                                        // updateAddAllToCartLink(selected_pdt[products[p].id]);
                                    }                          
                                }
                                else {
                                    cart_button_text.innerHTML = outOfStock;
                                    cart_button.classList.add("disable-btn-wrapper");
                                }
                            }
                        }
                        //displaying selected products
                        if (selectedVariant.length) {
                            for (let i = 0; i < selectedVariant.length; i++) {
                                products[p].variants.forEach((variant) => {
                                    if (selectedVariant[i] == variant.id) {
                                        let imgurl = getVariantImage(variant.image_id,products[p]);
                                        let product_url = domainUrl + "/products/" + products[p].handle + "?variant=" + variant.id;
                                        
                                        let addTocartClass; 
                                        let buttonText;

                                        if(variant.inventory_policy == "deny"){
                                            if(variant.inventory_quantity<1){
                                              if(variant.inventory_management!=null){
                                                addTocartClass = "disable-btn-wrapper";
                                                buttonText = outOfStock;
                                              }  
                                              else{
                                                buttonText = default_addToCartText;
                                                if (active_product_count == 0) {
                                                    allToCart += variant.id;
                                                } else {
                                                    allToCart += "&id[]=" + variant.id;
                                                }
                                                active_product_count++;
                                                // updateAddAllToCartLink(variant.id);
                                              }
                                            }
                                            else{
                                                buttonText = default_addToCartText;
                                                if (active_product_count == 0) {
                                                    allToCart += variant.id;
                                                } else {
                                                    allToCart += "&id[]=" + variant.id;
                                                }
                                                active_product_count++;
                                                // updateAddAllToCartLink(variant.id);
                                            }
                                        }
                                        else{
                                            buttonText = default_addToCartText;
                                            if (active_product_count == 0) {
                                                allToCart += variant.id;
                                            } else {
                                                allToCart += "&id[]=" + variant.id;
                                            }
                                            active_product_count++;
                                            // updateAddAllToCartLink(variant.id);
                                        }
                                        var product_html;
                                        selected_pdt[products[p].id] = variant.id;
                                        variant_price = variant.price;
                                        product_html = '<div><a id="url_tangent_product_' + p + '" class="tangent-text-link" target="_blank" href="' + product_url + '"><img id="image_tangent_product_' + p + '" src="' + imgurl + '"  class="tangent_product_image"><p class="tangent-product-title tangent_product_title_text"><b>' + products[p].title + '</b></p><p class="tangent-variant-title tangent_variant_title_text"><b>' + variant.title + '</b></p><p id="price_tangent_product_' + p + '" class="tangent_product_price_text">' + domainCurrency + variant_price + '</p></a><div id="tangent_product_' + p + '"></div><a class="tangent-product-add-btn-wrapper' + addTocartClass + '" id="cart_tangent_product_' + p + '" onclick="addToCart('+selected_pdt[products[p].id]+','+p+')" href="javascript: void(0)"><p class="tangent-btn-add tangent_add_to_cart_button" id="cart_tangent_product_' + p + '_text">' + buttonText + '</p></a>';
                                        var element = document.getElementById('tangent-products-section');
                                        element.innerHTML = element.innerHTML + product_html;
                                    }
                                })
                            }
                        }
                    }
                    addAllToCartLink = allToCart;
                    addToCartCount = active_product_count;
                    // ENABLE EVENT LISTENER FOR ALL OPTIONS
                    var all_options = document.getElementsByClassName('tangent_option');
                    for (var o = 0; o < all_options.length; o++) {
                        all_options[o].addEventListener(
                            'click',
                            function () { changePdtVariant(this); },
                            false
                        );
                    }
                }
                else {
                    document.getElementById('tangent-general-text').innerHTML = "No products found. Please retry!";
                    console.log("No products found Please retry");
                }

                if (jsonData.description != '') {
                    document.getElementById('tangent-checkout-description').style.display = "block";
                    document.getElementById('tangent-checkout-description').innerHTML = getCheckoutDescription(jsonData);
                }
                else {
                    document.getElementById('tangent-general-text').style.display = "block";
                }
            }
            else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
            }
            else {
                console.log('Something else other than 200 was returned');
            }
        }
    };

    xmlhttp.open("GET", checkout_url, true);
    xmlhttp.send();

}

function getCheckoutDescription(jsonData){
  let header_text = '';
  let name = jsonData.form?.name?.trim();
  
  if (name) {
    header_text = `<h1 style="text-align: center;">${name}, we think you'll love</h1>`;
  } else {
    header_text = `<h1 style="text-align: center;">We think you'll love</h1>`;
  }
  
  return header_text + jsonData.description;
}

// ADDING SCRIPT TO HEAD IN HTML
function addExternalScript(url){
    var _script = document.createElement("script"); 
    _script.src = url;  
    document.getElementsByTagName('head')[0].appendChild(_script);  
}

function addCssFromTemplateCustomise(){
    if(cCode!=undefined){
        var css = cCode,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
}

function updateAddAllToCartLink(id){
    if (active_product_count == 0) {
        allToCart += id;
    } else {
        allToCart += "&id[]=" + id;
    }
    active_product_count++;
}

function addAllTocartFunction() {
    if (addToCartCount > 0) {
        document.getElementById('tangent-add-all-to-cart').setAttribute("href", addAllToCartLink);
    }
    else {
        var x = document.getElementById("message-text");
        x.innerHTML = "We're currently sold out of the selected product(s). Please check back later!";
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 5000);
    }
}

function changePdtVariant(ele) {
    
    var cartUrl = domainUrl + "/cart/add?id[]=";
    var eleId = ele.id;
    var arr = eleId.split(":");

    var productNumberText = arr[0];
    var optionNumberText = arr[1];
    var pStart = productNumberText.lastIndexOf('_');
    var oStart = optionNumberText.lastIndexOf('_');

    // Product and Option Number
    var pNo = productNumberText.substring(pStart + 1);
    var oNo = optionNumberText.substring(oStart + 1);

    //Product ID
    var pId = parseInt(pNo);

    var element = document.getElementById("cart_tangent_product_"+pId+"_text");
    if(element!=undefined){
        element.classList.remove("added-to-cart-style");
    }

    // Product Details
    var pdt = products[pId];

    var variant_price = domainCurrency;

    // Product Variants
    var product_variants = pdt.variants;

    // Variant Option Values
    var opt1_value;
    var opt2_value;
    var opt3_value;

    // Getting current variant option selections
    if (product_variants.length > 0) {
        for (var pv = 0; pv < product_variants.length; pv++) {
            if (product_variants[pv].id == selected_pdt[pdt.id]) {
                prev_variant = product_variants[pv];
                opt1_value = product_variants[pv].option1;
                opt2_value = product_variants[pv].option2;
                opt3_value = product_variants[pv].option3;
            }
        }
    }

    var opt1_list;
    // Identify and Highlight new selection if it is on Option 1 list of Product
    if (ele.classList.contains("tangent_options_1")) {
        opt1_list = document.getElementsByClassName("product_" + pId + "v1");
        if (opt1_list.length > 0) {
            for (var op1 = 0; op1 < opt1_list.length; op1++) {
                if (op1 == oNo) {
                    opt1_list[op1].classList.add("tangent_selected-variant");
                    opt1_value = opt1_list[op1].innerHTML;
                }
                else {
                    opt1_list[op1].classList.remove("tangent_selected-variant");
                }
            }
        }
    }

    var opt2_list;
    // Identify and Highlight new selection if it is on Option 2 list of Product
    if (ele.classList.contains("tangent_options_2")) {
        opt2_list = document.getElementsByClassName("product_" + pId + "v2");
        if (opt2_list.length > 0) {
            for (var op2 = 0; op2 < opt2_list.length; op2++) {
                if (op2 == oNo) {
                    opt2_list[op2].classList.add("tangent_selected-variant");
                    opt2_value = opt2_list[op2].innerHTML;
                }
                else {
                    opt2_list[op2].classList.remove("tangent_selected-variant");
                }
            }
        }
    }

    var opt3_list;
    // Identify and Highlight new selection if it is on Option 3 list of Product
    if (ele.classList.contains("tangent_options_3")) {
        opt3_list = document.getElementsByClassName("product_" + pId + "v3");
        if (opt3_list.length > 0) {
            for (var op3 = 0; op3 < opt3_list.length; op3++) {
                if (op3 == oNo) {
                    opt3_list[op3].classList.add("tangent_selected-variant");
                    opt3_value = opt3_list[op3].innerHTML;
                }
                else {
                    opt3_list[op3].classList.remove("tangent_selected-variant");
                }
            }
        }
    }

    var option_variant_key;
    // Joining the options found and matching with options to variant mapping to get variant id
    if (opt1_value != null) {
        option_variant_key = opt1_value;
    }
    if (opt2_value != null) {
        option_variant_key = option_variant_key + "_" + opt2_value;
    }
    if (opt3_value != null) {
        option_variant_key = option_variant_key + "_" + opt3_value;
    }

    // Fetching and setting new variant id to selected product-id in product-variant map object
    if (option2_variant_map[pdt.id] != undefined) {
        if (option2_variant_map[pdt.id][option_variant_key] != undefined) {
            selected_pdt[pdt.id] = option2_variant_map[pdt.id][option_variant_key].id + "";
        }
    }

    var add_current_pdt = true;

    var cart_button = document.getElementById("cart_tangent_product_" + pId);
    var cart_button_text = document.getElementById("cart_tangent_product_" + pId + "_text");

    if(cart_button!=undefined){
        // Check if product is active and if not disable add to cart button
        if (pdt.status == "active") {
            cart_button.classList.remove("disable-btn-wrapper");

            // Choose variant object from variant list in product object using variant id mapped to product id in product-variant mapping object
            var variant_select;
            if (product_variants.length > 0) {
                for (var pv = 0; pv < product_variants.length; pv++) {
                    if (product_variants[pv].id == selected_pdt[pdt.id]) {
                        variant_select = product_variants[pv];
                    }
                }
            }

            if (variant_select != undefined) {

                if(variant_select.inventory_policy == "deny"){
                    if(variant_select.inventory_quantity<1){
                        if(variant_select.inventory_management!=null){
                            add_current_pdt = false;
                            cart_button_text.innerHTML = outOfStock;
                            cart_button.classList.add("disable-btn-wrapper");
                        }
                        else{
                            selected_pdt[pdt.id] = variant_select.id;
                            var pdt_cartUrl = cartUrl + selected_pdt[pdt.id];
                            cart_button.classList.remove("disable-btn-wrapper");
                            cart_button_text.innerHTML = default_addToCartText;
                            
                            var clickfun = cart_button.getAttribute("onClick");
                            var funName = clickfun.substring(0,clickfun.indexOf("("));   
                            cart_button.setAttribute("onclick",funName+"("+selected_pdt[pdt.id]+","+pId+")");   
                        } 
                    }
                    else{
                        selected_pdt[pdt.id] = variant_select.id;
                        var pdt_cartUrl = cartUrl + selected_pdt[pdt.id];
                        cart_button.classList.remove("disable-btn-wrapper");
                        cart_button_text.innerHTML = default_addToCartText;
                        
                        var clickfun = cart_button.getAttribute("onClick");
                        var funName = clickfun.substring(0,clickfun.indexOf("("));   
                        cart_button.setAttribute("onclick",funName+"("+selected_pdt[pdt.id]+","+pId+")");   
                    }
                }
                else{
                    selected_pdt[pdt.id] = variant_select.id;
                    var pdt_cartUrl = cartUrl + selected_pdt[pdt.id];
                    cart_button.classList.remove("disable-btn-wrapper");
                    cart_button_text.innerHTML = default_addToCartText;
                    
                    var clickfun = cart_button.getAttribute("onClick");
                    var funName = clickfun.substring(0,clickfun.indexOf("("));   
                    cart_button.setAttribute("onclick",funName+"("+selected_pdt[pdt.id]+","+pId+")");   
                }
            }
        }
        else {
            add_current_pdt = false;
            cart_button_text.innerHTML = outOfStock;
            cart_button.classList.add("disable-btn-wrapper");
        }
    }

    var sp = 0;
    // Loop through product list and update cart url for add all to cart
    for (var p = 0; p < products.length; p++) {
        var product_variants = products[p].variants;

        // Check if product status , if not skip adding to cart-url
        if (products[p].status == "active") {
            // If looping product and selection product same
            if (products[p].id == pdt.id) {
                if (add_current_pdt) {
                    if (sp == 0) {
                        cartUrl = cartUrl + selected_pdt[pdt.id];
                    }
                    else {
                        cartUrl = cartUrl + '&id[]=' + selected_pdt[pdt.id];
                    }
                    sp = sp + 1;
                }
            }
            else {

                // Loop through variants of looping product and find matched variant from selected product-variant mapping object
                for (var pv = 0; pv < product_variants.length; pv++) {
                    if (selected_pdt[products[p].id] == product_variants[pv].id) {
                        var variant_select = product_variants[pv].id;
                        if(variant_select.inventory_policy == "deny"){
                            if(variant_select.inventory_quantity<1){
                            if(variant_select.inventory_management==null){
                                if (sp == 0) {
                                cartUrl = cartUrl + product_variants[pv].id;
                                }
                                else {
                                    cartUrl = cartUrl + '&id[]=' + product_variants[pv].id;
                                }
                                sp = sp + 1;
                            } 
                            }
                            else{
                                if (sp == 0) {
                                cartUrl = cartUrl + product_variants[pv].id;
                                }
                                else {
                                    cartUrl = cartUrl + '&id[]=' + product_variants[pv].id;
                                }
                                sp = sp + 1;
                            }
                        }
                        else{
                            if (sp == 0) {
                                cartUrl = cartUrl + product_variants[pv].id;
                            }
                            else {
                                cartUrl = cartUrl + '&id[]=' + product_variants[pv].id;
                            }
                            sp = sp + 1;
                        }
                    }
                }
            }
        }
        variant_product_url = domainUrl + '/products/';
        // To Set Variant Price dynamically 
        if (products[p].id == pdt.id) {
            var variant_pdt_matched = false;
            for (var pv = 0; pv < product_variants.length; pv++) {
                if (selected_pdt[products[p].id] == product_variants[pv].id) {
                    variant_pdt_matched = true;
                    variant_price = variant_price + product_variants[pv].price;
                    variant_product_url = variant_product_url + pdt.handle + "?variant=" + product_variants[pv].id;
                    
                    variant_image = getVariantImage(product_variants[pv].image_id, products[p]);
                }
            }
            if (!variant_pdt_matched) {
                variant_price = variant_price + product_variants[0].price;
                variant_product_url = variant_product_url + pdt.handle + "?variant=" + product_variants[0].id;
            }
            document.getElementById("url_tangent_product_" + pId).href = variant_product_url;
        }
    }
    document.getElementById("price_tangent_product_" + pId).innerHTML = variant_price;

    // Change of image based on variant
    if(variant_image!=undefined){
        document.getElementById("image_tangent_product_" + pId).src = variant_image;
    }

    addToCartCount = sp;
    addAllToCartLink = cartUrl;
}

const isSelectedVariantPresent = (selectedVariants, productId) => {
    for (let key in selectedVariants) {
        if (key == productId) {
            if (selectedVariants[key] == null) {
                return [];
            }
            else if (typeof selectedVariants[key] == "string") {
                return selectedVariants[key].split();
            }
            else {
                return selectedVariants[key];
            }
        }
    }
}

const getVariantImage = (imageId, product) => {
    var pdtImg;
    
    if(imageId!=null){
        var all_images = product.images;
        if(all_images!=undefined){
            for(var im=0;im<all_images.length;im++){
                if(imageId==all_images[im].id){
                    pdtImg = all_images[im].src;
                }
            }
        }
    }
    else{
        if(product.image!=null){
            pdtImg = product.image.src;
        }
        else{
            pdtImg = 'https://file.tangent.ai/quiz-content/merchants/nitesh-dev-store/image/5009378275701413-no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c_720x.webp';
        }
    }

    if(pdtImg== undefined || pdtImg==null){
        pdtImg = 'https://file.tangent.ai/quiz-content/merchants/nitesh-dev-store/image/5009378275701413-no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c_720x.webp';
    }
    return pdtImg;
}

function addToCart(pid, eId){ 
    var data = {
        "id": pid,
        "quantity": 1
    };
      
    jQuery.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: data,
        dataType: 'json',
        success: function() { 
            var element = document.getElementById("cart_tangent_product_"+eId+"_text");
            if(element!=undefined){
                element.innerHTML = default_addedToCartText;
                element.classList.add("added-to-cart-style");
            }

            document.documentElement.dispatchEvent(new CustomEvent('cart:build', {bubbles: true}));
            document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {bubbles: true}));
            
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Error on adding to cart",textStatus);
            Shopify.onError(XMLHttpRequest, textStatus);
        }
    });
    
}