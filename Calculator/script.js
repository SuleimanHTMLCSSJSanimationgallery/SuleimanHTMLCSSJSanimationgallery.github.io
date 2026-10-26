var num1, num2, result;
num1 = window.prompt("Enter first number: ");
num1 = parseFloat(num1);
num2 = window.prompt("Enter second number: ");
num2 = parseFloat(num2);
var op = window.prompt("Enter operator (+, -, *, /): ");
if (op == "+") {
  result = num1 + num2;
  document.write("The result is: " + result);
} else if (op == "-") {
  result = num1 - num2;
  document.write("The result is: " + result);
} else if (op == "*") {
  result = num1 * num2;
  document.write("The result is: " + result);
} else if (op == "/") {
  result = num1 / num2;
  document.write("The result is: " + result);
} else {
  document.write("Invalid operator!");
}
