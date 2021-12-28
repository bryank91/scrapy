window.addEventListener('load', function () {
    (async () => {
    
    let data = [];
    data["id"] = id;
    data["quantity"] = 1;
    data["form_type"] = 1;
    const formData = new FormData();
    for(const name in data) {
        formData.append(name, data[name]);
    } 

    // change the website.com to a shopify enabled website
    const rawResponse = await fetch('https://website.com/cart/add.js', {
        method: 'POST',
        body: formData
    });
    const content = await rawResponse.json();

    console.log(content);
    })();
});