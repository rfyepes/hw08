const TAX = 0.0625;
const NUM_ITEMS = 5;

window.onload = function() {
  
  /* for each item on the menu, set the cost to 0 and update when altered */
  for (let i = 0; i < NUM_ITEMS; i++) {
    itemName = "[name='quan" + i + "']";
    $(itemName).change(updateQuantity);
    $(itemName).change();
  }
  
  /* hide street and city fields unless they choose delivery */
  $("[name='p_or_d']").change(changeAddressDisplay);
  $("[value='pickup']").change();
  
  /* set up an event handler for the submit button */
  $("[type='button']").click(submitOrder);
  
}

function updateQuantity()
{
  /* this selection's name can tell us which menu item we're dealing with */
  index = parseInt(this.name.substring(4));
  cost = menuItems[index].cost * this.value;
  $("[name='cost']")[index].value = cost.toFixed(2);
  
  updateTotal();
}

function updateTotal()
{
  /* iterate through every item's cost and find the overall cost (subtotal) */
  subtotal = 0;
  items = document.getElementsByName("cost");
  for (let i = 0; i < items.length; i++) {
    subtotal += parseFloat(items[i].value);
  }
  
  /* update the subtotal, tax, and total boxes */
  $("#subtotal")[0].value = subtotal.toFixed(2);
  $("#tax")[0].value = (subtotal * TAX).toFixed(2);
  $("#total")[0].value = (subtotal + subtotal * TAX).toFixed(2);
}

function changeAddressDisplay()
{
  /* if the customer chose pickup, hide the address information */
  if (this.value == "pickup") {
    $(".address").css("display", "none");
  } else {
    $(".address").css("display", "block");
  }
}

function submitOrder()
{
  /* ensure a last name and valid phone number have been entered */
  if (invalidContact() || invalidAddress() || invalidOrder()) {
    return;
  }
  
  /* thank the user for their order */
  alert("Thank you for your order!");
  
  /* store the order info in an object that can be accessed by the pop-up tab */
  localStorage.setItem("orderInfo", getOrderInfo());

  /* open the pop-up tab with the user's order information */
  order = window.open("your_order.html");
}

function invalidContact()
{
  /* create a custom error message depending on the missing information */
  error = "Please enter";
  if ($("[name='lname']")[0].value == "") {
    error += " your last name"
    error += (invalidNumber()) ? " and a valid phone number." : "."
  } else if (invalidNumber()) {
    error += " a valid phone number."
  } else {
    return false;
  }
  
  alert(error);
  return true;
}

function invalidNumber()
{
  numCount = 0;
  number = $("[name='phone']")[0].value;
  
  /* count how many digits are in the inputted string */
  for (let i = 0; i < number.length; i++) {
    if (!isNaN(number[i])) { numCount++; }
  }
  
  /* the number is only valid if there are 7 or 10 digits */
  if (numCount == 7 || numCount == 10) {
    return false;
  } else {
    return true;
  }
}

function invalidAddress()
{
  /* if the customer selected pickup, we don't need an address anyway */
  if ($("[value='pickup']")[0].checked) {
    return false;
  }
  
  /* check that a city was inputted */
  validCity = false;
  if ($("[name='city']")[0].value != "") {
    validCity = true;
  }
  
  /* create a custom error message depending on the missing information */
  error = "Please enter"
  if ($("[name='street']")[0].value == "") {
    error += " your street"
    error += validCity ? "." : " and city."
  } else if (!validCity) {
    error += " your city."
  } else {
    return false;
  }
  
  alert(error);
  return true;
}

function invalidOrder()
{
  /* check whether or not the customer chose anything to order */
  if ($("#subtotal")[0].value == "0.00") {
    alert("You haven't chosen anything to order!");
    return true;
  } else {
    return false;
  }
}

function getOrderInfo()
{
  /* add each item the user is ordering to an array */
  items = [];
  for (let i = 0; i < NUM_ITEMS; i++) {
    quantity = $("[name='quan" + i + "']")[0].value;
    if (quantity != 0) {
      items.push({ 
        name: menuItems[i].name, 
        quan: quantity, 
        cost: (quantity * menuItems[i].cost).toFixed(2)  
      });
    }
  }
  
  /* pack all the order information into an object */
  orderInfo = { 
    time: timeEstimate(),
    pickup: ($("[value='pickup']")[0].checked) ? true : false,
    items: items,
    subtotal: $("#subtotal")[0].value,
    tax: $("#tax")[0].value,
    total: $("#total")[0].value
  };
  
  /* return the order information as a stringified JSON object */
  return JSON.stringify(orderInfo);
}

function timeEstimate()
{
  /* get the current time and add 15 or 30 mins, depending on the order type */
  time = new Date();
  if ($("[value='pickup']")[0].checked) {
    time.setMinutes(time.getMinutes() + 15);
  } else {
    time.setMinutes(time.getMinutes() + 30);
  }
  
  /* get the hour and minutes, transform the hour from 0-23 to 1-12 format */
  hour = time.getHours();
  hour = (hour > 12) ? hour - 12 : (hour == 0) ? 12 : hour;
  mins = time.getMinutes();
  
  /* create the time as a string */
  timeString = hour + ":";
  timeString += (mins < 10) ? "0" + mins : mins;
  timeString += (time.getHours() < 12) ? " AM" : " PM";
  
  return timeString;
}
