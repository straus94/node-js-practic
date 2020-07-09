const toCurrency = price =>  {
    return new Intl.NumberFormat('de-DE', {
        currency: 'EUR',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const $card = document.getElementById('card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
              .then(basket => {
                  if (basket.courses.length) {
                      console.log(basket);
                      const html = basket.courses.map(c => {
                          return `
                            <tr>    
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                </td>
                            </tr>
                          `
                      }).join('');
                      $card.querySelector('tbody').innerHTML = html;
                      $card.querySelector('.price').textContent = toCurrency(basket.price);
                  } else {
                      $card.innerHTML = `<p>Empty basket</p>`;
                  }

              })
        }
    })
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

M.Tabs.init(document.querySelectorAll('.tabs'));
