module.exports = function Cart(oldCart) {
    //asign values
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.stripePrice = oldCart.totalPrice || 0;
    //group items add to new item to cart
    this.add = function(item, id) {
        //check if item exist in cart
        var storedItem = this.items[id];
        //if items doesn't exist in cart create new one
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
       
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
        this.stripePrice += storedItem.item.price;
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};