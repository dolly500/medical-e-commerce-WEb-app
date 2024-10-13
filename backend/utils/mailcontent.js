const sendMail = require("../utils/sendMail");

//send mail for order confirmation

const sendOrderConfirmation = async (order, shippingFee, TotalFees) => {
  // Constructing the HTML content for the email
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 80%;
                  margin: auto;
                  background: #fff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #333;
              }
              .cart-summary {
                  margin-top: 20px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
              }
              table, th, td {
                  border: 1px solid #ddd;
              }
              th, td {
                  padding: 10px;
                  text-align: left;
              }
              th {
                  background-color: #f8f8f8;
              }
              .total-price {
                  font-weight: bold;
                  font-size: 1.2em;
                  color: #333;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Thank you for shopping with us, ${order.user[0].name}!</h1>
              <p>Your Pay on Delivery order has been successfully placed. Here are the details of your order:</p>
              <h2>Order Details:</h2>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Shipping Address:</strong><br>
                  ${order.user[0].name}<br>
                  ${order.shippingAddress.address}<br>
                  ${order.shippingAddress.city}, ${
    order.shippingAddress.country
  }, ${order.shippingAddress.postalCode}<br>
                  ${order.shippingAddress.country}</p> 
              <div class="cart-summary">
                  <h2>Cart Summary:</h2>
                  <table>
                      <thead>
                          <tr>
                              <th>Item Name</th>
                              <th>Quantity</th>
                              <th>Price</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${order.cart
                            .map(
                              (item) => `
                          <tr>
                              <td>${item.productName}</td>
                              <td>${item.quantity}</td>
                              <td>${item.discountPrice}</td>
                          </tr>`
                            )
                            .join("")}
                      </tbody>
                  </table>
                  <p class="total-price">Total Price: ${order.totalPrice}</p>
              </div>
  
              <h2>Next Steps:</h2>
              <p>Your order will be shipped shortly. Use the tracking number above to track your package. Remember to have your payment ready upon delivery. If you have any questions, our support team is just an email or call away!</p>
  
              <p>We’re truly grateful for your business, and can’t wait to serve you again soon! 🛍️</p>
  
              <div class="footer">
                  <p>Best regards,<br>MediatorePro Team</p>
              </div>
          </div>
      </body>
      </html>
    `;
  // Sending the email with HTML content
  const subject = "Order Confirmation";
  const email = order.user[0].email;
  await sendMail({
    email,
    subject,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: auto;
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
            }
            .cart-summary {
                margin-top: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            table, th, td {
                border: 1px solid #ddd;
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f8f8f8;
            }
            .total-price {
                font-weight: bold;
                font-size: 1.2em;
                color: #333;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Thank you for shopping with us, ${order.user[0].name}!</h1>
            <p>Your Pay on Delivery order has been successfully placed. Here are the details of your order:</p>
            <h2>Order Details:</h2>
            <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
            <p><strong>Shipping Address:</strong><br>
                ${order.user[0].name}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${
  order.shippingAddress.country
}, ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}</p> 
            <div class="cart-summary">
                <h2>Cart Summary:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.cart
                          .map(
                            (item) => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.discountPrice}</td>
                        </tr>`
                          )
                          .join("")}
                    </tbody>
                </table>
                <p>Shipping Fee: $${shippingFee}</p>
                <p class="total-price">Total Fee: $${TotalFees}</p>
            </div>

            <h2>Next Steps:</h2>
            <p>Your order will be shipped shortly. Use the tracking number above to track your package. Remember to have your payment ready upon delivery. If you have any questions, our support team is just an email or call away!</p>

            <p>We’re truly grateful for your business, and can’t wait to serve you again soon! 🛍️</p>

            <div class="footer">
                <p>Best regards,<br>MediatorePro Team</p>
            </div>
        </div>
    </body>
    </html>
  `,
  });
};

const sendAdminNotifcation = async(order, shippingFee, TotalFees) => {
     // Sending the email with HTML content
  const subject = "New Order Notification";
  const email = "dolapoakamo01@gmail.com"
  await sendMail({
    email,
    subject,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: auto;
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
            }
            .cart-summary {
                margin-top: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            table, th, td {
                border: 1px solid #ddd;
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f8f8f8;
            }
            .total-price {
                font-weight: bold;
                font-size: 1.2em;
                color: #333;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
        <p><strong>Dear Admin,</strong></p>
            <p>A new Pay on Delivery order has been successfully placed. Please find the details below:</p>
            <h2>Order Details:</h2>
             <p>Customer Name: ${order.user[0].name}</p>
              <p>Customer Mail: ${order.user[0].email}</p>
            <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
            <p><strong>Shipping Address:</strong><br>
                ${order.user[0].name}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${
  order.shippingAddress.country
}, ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}</p> 
            <div class="cart-summary">
                <h2>Cart Summary:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.cart
                          .map(
                            (item) => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.discountPrice}</td>
                        </tr>`
                          )
                          .join("")}
                    </tbody>
                </table>
                <p>Shipping Fee: $${shippingFee}</p>
                <p class="total-price">Total Fee: $${TotalFees}</p>
            </div>
            <h2>Next Steps:</h2>
            <p>Please prepare the order for shipping</p>
            <p>We ensure the customer is informed about the payment upon delivery.</p>
            <div class="footer">
                <p>Best regards,<br>MediastorePro Team</p>
            </div>
        </div>
    </body>
    </html>
  `,
  });
}

const sendOnlineAdminNotifcation = async(order, platform, shippingFee, TotalFees) => {
    // Sending the email with HTML content
 const subject = "New Order Notification";
 const email = "dolapoakamo01@gmail.com"
 await sendMail({
   email,
   subject,
   html: `
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Order Confirmation</title>
       <style>
           body {
               font-family: Arial, sans-serif;
               line-height: 1.6;
               background-color: #f4f4f4;
               margin: 0;
               padding: 0;
           }
           .container {
               width: 80%;
               margin: auto;
               background: #fff;
               padding: 20px;
               border-radius: 10px;
               box-shadow: 0 2px 5px rgba(0,0,0,0.1);
           }
           h1 {
               color: #333;
           }
           .cart-summary {
               margin-top: 20px;
           }
           table {
               width: 100%;
               border-collapse: collapse;
               margin-bottom: 20px;
           }
           table, th, td {
               border: 1px solid #ddd;
           }
           th, td {
               padding: 10px;
               text-align: left;
           }
           th {
               background-color: #f8f8f8;
           }
           .total-price {
               font-weight: bold;
               font-size: 1.2em;
               color: #333;
           }
           .footer {
               text-align: center;
               margin-top: 30px;
               color: #777;
           }
       </style>
   </head>
   <body>
       <div class="container">
       <p><strong>Dear Admin,</strong></p>
           <p>A new order has been successfully placed on <strong>${platform} </strong>. Please find the details below:</p>
           <h2>Order Details:</h2>
            <p>Customer Name: ${order.user[0].name}</p>
             <p>Customer Mail: ${order.user[0].email}</p>
           <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
           <p><strong>Shipping Address:</strong><br>
               ${order.user[0].name}<br>
               ${order.shippingAddress.address}<br>
               ${order.shippingAddress.city}, ${
 order.shippingAddress.country
}, ${order.shippingAddress.postalCode}<br>
               ${order.shippingAddress.country}</p> 
           <div class="cart-summary">
               <h2>Cart Summary:</h2>
               <table>
                   <thead>
                       <tr>
                           <th>Item Name</th>
                           <th>Quantity</th>
                           <th>Price</th>
                       </tr>
                   </thead>
                   <tbody>
                       ${order.cart
                         .map(
                           (item) => `
                       <tr>
                           <td>${item.productName}</td>
                           <td>${item.quantity}</td>
                           <td>$${item.discountPrice}</td>
                       </tr>`
                         )
                         .join("")}
                   </tbody>
               </table>
               <p>Shipping Fee: $${shippingFee}</p>
               <p class="total-price">Total Fee: $${TotalFees}</p>
           </div>
           <h2>Next Steps:</h2>
           <p>Please prepare the order for shipping</p>
           <p>We ensure the customer is informed about the payment upon delivery.</p>
           <div class="footer">
               <p>Best regards,<br>MediastorePro Team</p>
           </div>
       </div>
   </body>
   </html>
 `,
 });
}


module.exports = {sendOrderConfirmation, sendAdminNotifcation, sendOnlineAdminNotifcation};
