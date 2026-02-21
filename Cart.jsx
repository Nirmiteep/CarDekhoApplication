import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.css";

function Cart() {
 let [carts, setcart] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/carts")
      .then((res) => {
        setcart(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);5

  function remove(id) {
  axios
    .delete(`http://localhost:8080/cart/${id}`)
    .then(() => {
      setcart((prev) => prev.filter((c) => c.cartid !== id));
    })
    .catch((error) => {
      console.log(error);
    });
}

  return (
    <div className="cart-wrapper">
      <h1 className="cart-title">Your Cart</h1>

      {carts.length === 0 ? (
        <div className="empty-cart">
          <h2> Your cart is empty</h2>
          <p>Add some cars to get started.</p>
        </div>
      ) : (
        <div className="cart-grid">
          {carts.map((cart) => {
            if (!cart.car) return null;

            return (
              <div className="cart-card" key={cart.cartid}>
                <img
                  src={cart.car.image}
                  alt={cart.car.model}
                  className="cart-image"
                />
                <div className="cart-info">
                  <h2>{cart.car.brand}</h2>
                  <h3>{cart.car.model}</h3>
                  <p className="price">₹ {cart.car.price}</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => remove(cart.cartid)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default Cart;
