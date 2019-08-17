const $ = require("jquery");

const openingBrackets = " ( [ { ";
const closingBrackets = " ) ] } ";
const operators = " + - * / ^ ";

class Expression {
  infix: string;
  postfix: string;
  prefix: string;
  evaluation: number;

  constructor(input: string, direction: string) {
    switch (direction) {
      case "InFix":
        this.infix = input;
        this.postfix = this.inToPost();
        // console.log(postfix);
        this.prefix = this.inToPre();
        // console.log(prefix);
        this.evaluation = this.evaluate();
        // console.log(evaluation);
        break;
      case "PostFix":
        this.postfix = input;
        // console.log(postfix);
        this.infix = this.postToIn();
        // console.log(infix);
        this.prefix = this.inToPre();
        // console.log(prefix);
        this.evaluation = this.evaluate();
        // console.log(evaluation);
        break;
      case "PreFix":
        this.prefix = input;
        // console.log(prefix);
        this.infix = this.preToIn();
        // console.log(infix);
        this.postfix = this.inToPost();
        // console.log(postfix);
        this.evaluation = this.evaluate();
        // console.log(evaluation);
        break;

      default:
        break;
    }
  }
  /* =========================== GETTERS ===========================*/
  // Expression::getInfix() {
  //   return infix;
  // }
  // Expression::getPrefix() {
  //   return prefix;
  // }
  // Expression::getPostfix() {
  //   return postfix;
  // }
  /* ========================================================================*/

  /* ============================== CONVERTERS ==============================*/

  /* ~~~~~~~~~~~~~~~~~~ Infix to Postfix ~~~~~~~~~~~~~~~~~~*/
  inToPost() {
    let operatorStack = [];
    let output = "";
    let tokens = this.infix.trim().split(" ");

    tokens.forEach(t => {
      // case ‘(‘ :  push on Stack
      if (isOpeningBracket(t)) {
        operatorStack.push(t + " ");
      } else if (isOperand(t)) {
        // case ‘operand’ : write on output
        output += t + " ";
      } else if (isOperator(t)) {
        // case ‘operator’ : push on Stack
        if (
          operatorStack.length == 0 || // todo verify
          openingBrackets.includes(peek(operatorStack))
        ) {
          operatorStack.push(t + " ");
        } else {
          while (operatorStack.length != 0) {
            if (
              operators.includes(peek(operatorStack)) &&
              t[0] <= peek(operatorStack)[0]
            ) {
              output += operatorStack.pop() + " ";
            } else {
              break;
            }
          }
          while (operatorStack.length != 0) {
            let item = operatorStack.pop();
            if (openingBrackets.includes(item)) {
              break;
            } else {
              {
                output += item + " ";
              }
            }
          }
        }
      }
      // case ‘)’ :  pop operator and write on output pop  ‘(‘ and discard
      if (isClosingBracket(t)) {
        while (operatorStack.length != 0) {
          let item = operatorStack.pop();
          if (openingBrackets.includes(item)) {
            break;
          } else {
            {
              output += item + " ";
            }
          }
        }
      }
    });
    while (operatorStack.length != 0) {
      let item = operatorStack.pop();
      if (openingBrackets.includes(item)) {
        // break;
      } else {
        {
          output += item + " ";
        }
      }
    }
    return output;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /* ~~~~~~~~~~~~~~~~~~ Infix to Prefix ~~~~~~~~~~~~~~~~~~*/
  inToPre() {
    let operatorStack = [];
    let operandsStack = [];
    let output = "";

    let tokens = this.infix.trim().split(/\s+/);

    tokens.forEach(t => {
      if (isOperand(t)) {
        operandsStack.push(t);
      } else if (isOpeningBracket(t)) {
        operatorStack.push(t);
      } else if (isClosingBracket(t)) {
        while (!isOpeningBracket(peek(operatorStack))) {
          let expression = "";

          let op = operatorStack.pop();
          let n1 = operandsStack.pop();
          console.log("n1 = " + n1);
          let n2 = operandsStack.pop();
          console.log("n2 = " + n2);

          expression += op + " ";
          expression += n2 + " ";
          expression += n1;

          operandsStack.push(expression);
        }
        operatorStack.pop();
      } else if (isOperator(t)) {
        console.log(t);
        if (
          operatorStack.length == 0 ||
          checkPrecedence(t, peek(operatorStack)) ||
          isOpeningBracket(peek(operatorStack))
        ) {
          operatorStack.push(t);
        } else {
          while (operatorStack.length != 0) {
            let expression = "";

            let op = operatorStack.pop();
            let n1 = operandsStack.pop();
            console.log("n1 = " + n1);
            let n2 = operandsStack.pop();
            console.log("n2 = " + n2);

            expression += op + " ";
            expression += n2 + " ";
            expression += n1;

            operandsStack.push(expression);
          }
          operatorStack.pop();
        }
      }
    });
    while (operatorStack.length != 0) {
      let expression = "";

      let op = operatorStack.pop();
      let n1 = operandsStack.pop();
      console.log("n1 = " + n1);
      let n2 = operandsStack.pop();
      console.log("n2 = " + n2);

      expression += op + " ";
      expression += n2 + " ";
      expression += n1;

      operandsStack.push(expression);
    }

    return operandsStack.pop();
  }
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /* ~~~~~~~~~~~~~~~~~~ Postfix to Infix ~~~~~~~~~~~~~~~~~~*/
  postToIn() {
    let operandsStack = [];

    let v = this.postfix.split(/\s+/);
    v.forEach(s => {
      console.log(s);
      if (isOperand(s)) {
        operandsStack.push(s);
      } else {
        let right = operandsStack.pop();
        let left = operandsStack.pop();
        let expression = `( ${left} ${s} ${right} )`;
        operandsStack.push(expression);
      }
    });

    return operandsStack.pop();
  }
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /* ~~~~~~~~~~~~~~~~~~ Prefix to Infix ~~~~~~~~~~~~~~~~~~*/
  preToIn() {
    let operandsStack = [];
    let v = this.prefix.split(/\s+/);
    for (let i = v.length - 1; i >= 0; i--) {
      let s = v[i];

      if (isOperand(s)) {
        operandsStack.push(s);
      } else {
        let left = operandsStack.pop();
        let right = operandsStack.pop();
        let expression = `( ${left} ${s} ${right} )`;
        operandsStack.push(expression);
      }
    }
    return operandsStack.pop();
  }
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /* ~~~~~~~~~~~~~~~~~~ Prefix Evaluate~~~~~~~~~~~~~~~~~~*/
  evaluate() {
    let operandsStack = [];
    let tokens = this.postfix.trim().split(/\s+/);

    tokens.forEach(t => {
      if (isOperand(t)) {
        operandsStack.push(t);
      } else {
        let right = parseFloat(operandsStack.pop());
        let left = parseFloat(operandsStack.pop());
        let result = 0;
        switch (t) {
          case "+":
            result = left + right;
            break;

          case "-":
            result = left - right;
            break;

          case "*":
            result = left * right;
            break;

          case "/":
            result = left / right;
            break;

          case "^":
            result = left ** right;
            break;

          default:
            break;
        }

        operandsStack.push(result);
      }
    });

    return operandsStack.pop();
  }
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /* ================================================================================================*/
}

function isOpeningBracket(s) {
  return openingBrackets.includes(s);
}

function isClosingBracket(s) {
  return closingBrackets.includes(s);
}

function isOperator(s) {
  return operators.includes(s);
}

function isOperand(s) {
  return !isNaN(parseInt(s, 10)) || /^[A-Z]$/i.test(s);
}

function peek(stack) {
  return stack[stack.length - 1];
}

$("#converter").on("submit", event => {
  event.preventDefault();
  let input = $("#input").val();
  let direction = $('input[name="from"]:checked').val().toString();

  let expression = new Expression(input.toString(), direction);

  /* ===============          INFIX TO POSFIX          ===============*/
  $("#InFix").html("");
  $("#InFix").append(`<legend>POSTFIX</legend>${expression.postfix}`);

  /* ===============          INFIX TO PREFIX          ===============*/
  $("#PostFix").html("");
  $("#PostFix").append(`<legend>PREFIX</legend>${expression.prefix}`);

  /* ===============          POSTFIX TO INFIX          ===============*/
  $("#PreFix").html("");
  $("#PreFix").append(`<legend>INFIX</legend>${expression.infix}`);

  /* ===============          EVALUATE          ===============*/
  if (expression.evaluation.toString() != "undefined") {
    $("#eval").html("");
    $("#eval").append(
      `<legend>EVALUATE</legend>${expression.evaluation.toString()}`
    );
  }

  $("fieldset").css({ display: "block" });
});

$(".input-btn").on("click", e => {
  e.preventDefault;
  let inputValue = $("#input").val().toString();
  let thisValue = $(e.target).val().toString();
  $("#input").val(`${inputValue} ${thisValue}`);
});

$("#backspace").on("click", e => {
  e.preventDefault();
  let inputValue = $("#input").val().toString();
  console.log(inputValue);
  inputValue = inputValue.slice(0, -2);
  $("#input").val(inputValue);
});

function inputAdd(c) {
  // let str = "";
  // if (inputValue == " ") {
  //   str = inputValue.trim();
  //   str += c;
  //   $('#input').val("");
  //   $('#input').val(str);
  // } else
}

function checkPrecedence(n1, n2) {
  switch (n1) {
    case "+":
      if (n2 == "+") return false;
      if (n2 == "-") return false;
      if (n2 == "*") return false;
      if (n2 == "/") return false;
      if (n2 == "^") return false;

      break;

    case "-":
      if (n2 == "+") return false;
      if (n2 == "-") return false;
      if (n2 == "*") return false;
      if (n2 == "/") return false;
      if (n2 == "^") return false;

      break;

    case "*":
      if (n2 == "+") return true;
      if (n2 == "-") return true;
      if (n2 == "*") return false;
      if (n2 == "/") return false;
      if (n2 == "^") return false;

      break;

    case "/":
      if (n2 == "+") return true;
      if (n2 == "-") return true;
      if (n2 == "*") return false;
      if (n2 == "/") return false;
      if (n2 == "^") return false;

      break;
    case "^":
      if (n2 == "+") return true;
      if (n2 == "-") return true;
      if (n2 == "*") return false;
      if (n2 == "/") return false;
      if (n2 == "^") return false;

      break;

    default:
      return true;
  }
}
