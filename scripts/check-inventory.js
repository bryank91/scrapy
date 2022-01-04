(async () => {
    const formData = new FormData();
    const itemIds = ['111', '222'];

    for (const itemId of itemIds) {
      formData.append('id', itemId);
      formData.append('quantity', 1);
      formData.append('form_type', 1);
      (await fetch('https://website.com/cart/add.js', {
          method: 'POST',
          body: formData
      })).json();
    }
    console.log('done');
  })();