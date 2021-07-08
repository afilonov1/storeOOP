'use strict';

class Cart {
	products = [];
	sumCount = 0;

	init() {
		let boxCart = document.querySelector('.right__cart');

		this.inCart = document.createElement('div');
		this.inCart.classList.add('right__cart-inCart');
		boxCart.append(this.inCart);

		this.tableBox = document.createElement('div');
		this.tableBox.classList.add('right__cart-table');
		this.tableBox.style.display = 'none';
		boxCart.append(this.tableBox);

		this.table = document.createElement('div');
		this.tableBox.append(this.table);

		this.clear = document.createElement('button');
		this.clear.classList.add('clear');
		this.clear.innerHTML = "Очистить корзину";
		this.tableBox.append(this.clear);

		boxCart.addEventListener('click', this.showCartTable.bind(this));
		this.clear.addEventListener('click', this.clearCart.bind(this));

		document.querySelectorAll('.items__item-image-AddToCart-but').forEach((but) => {
			but.addEventListener('click', this.addToCart.bind(this));
		});

		this.loadCart();
		this.showCount();
	}

	addToCart(event) {
		event.preventDefault();
		let productCard = event.target.closest('a');
		let name = productCard.querySelector('.items__item-header').innerText;
		let cost = productCard.querySelector('.items__item-cost').innerText;
		cost = +cost.slice(1);
		this.addProduct(new Product(productCard, name, cost));
	}

	showCartTable(event) {
		if (!this.tableBox.style.display || !this.sumCount) {
			this.tableBox.style.display = 'none';
		} else {
			this.tableBox.style.display = '';
		}

		if (this.sumCount) {
			event.preventDefault();
		}
	}

	updateTable() {
		let tableHTML = '<table><tr><th>Название</th><th>Колличество</th><th>Цена за шт.</th><th>Итог</th></tr>';
		let sumCost = 0;
		for (const prod of this.products) {
			let name = prod.name;
			let count = prod.count;
			let cost = prod.cost;
			let calcSum = prod.count * prod.cost;
			tableHTML += `<tr><td>${name}</td><td>${count} шт.</td><td>$${cost}</td><td>$${calcSum}</td></tr>`;
			sumCost += calcSum;
		}
		tableHTML += `<tr><td colspan="3" class='total'>Итого:</td><td>$${sumCost}</td></tr></table>`;
		this.table.innerHTML = tableHTML;
	}

	checkProduct(product) {
		for (const prod of this.products) {
			if (prod.cardNode == product.cardNode) {
				return prod;
			}
		}
		return false;
	}

	addProduct(product) {
		let prod = this.checkProduct(product);
		if (prod) {
			prod.addCount();
		} else {
			this.products.push(product);
		}
		this.calcSumCount();
		this.showCount();
		this.updateTable();
		this.saveCart();
	}

	showCount() {
		if (!this.sumCount) {
			this.inCart.style.display = 'none';
			return;
		}
		this.inCart.style.display = '';
		this.inCart.innerHTML = this.sumCount;
	}

	calcSumCount() {
		this.sumCount = 0;
		for (const prod of this.products) {
			this.sumCount += prod.count;
		}
	}

	clearCart(event) {
		this.sumCount = 0;
		this.products = [];
		this.updateTable();
		this.showCount();
		this.showCartTable(event);
		localStorage.removeItem('basket');
		event.stopPropagation();
		event.preventDefault();
	}

	saveCart() {
		localStorage.setItem('basket', JSON.stringify(this.products));
	}

	loadCart() {
		let products = localStorage.getItem('basket', false)
		if (!products) {
			return;
		}
		this.products = JSON.parse(products);
		this.calcSumCount();
		this.updateTable();
	}
}

class Product {
	constructor(cardNode, name, cost) {
		this.cardNode = cardNode;
		this.name = name;
		this.cost = cost;
		this.count = 1;
	}

	addCount() {
		this.count++;
	}
}

window.addEventListener('load', () => {
	const cart = new Cart;
	cart.init();
})



