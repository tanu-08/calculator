import './App.css';
import React, { useState } from "react";
import Button from './components/Button';
import ButtonBox from './components/ButtonBox';
import Wrapper from './components/Wrapper';
import Screen from './components/Screen';

// creating array for setting button
const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
    history:[],
    containsDecimal: false
  });
  
// handle number click 
  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(calc.num).length < 32) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.num+value)))
            : toLocaleString(calc.num+value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };
  //handle decimal click

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.containsDecimal ? calc.num + value : calc.num,
      containsDecimal: true
    });
  };

  //handle airthmetic sign click 
  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      sign: value,
      res:  calc.num ? calc.num+value : calc.res,
      num: (calc.num.substring(calc.num.length-1,calc.num.length)==="+" || 
      calc.num.substring(calc.num.length-1,calc.num.length)==="-" ||
      calc.num.substring(calc.num.length-1,calc.num.length)==="/" 
      || calc.num.substring(calc.num.length-1,calc.num.length)==="X")?calc.num.substring(0,calc.num.length-1)+value:calc.num+value,
      containsDecimal: false,
    });
  };

//handles equals
const equalsClickHandler = () => {
  if (calc.sign && calc.num) {
    const math = (a, b, sign) =>
      sign === "+"
        ? a + b
        : sign === "-"
        ? a - b
        : sign === "X"
        ? a * b
        : a / b;

    let expression =removeSpaces(calc.num);
    console.log(expression);

    try {
      expression = expression.replace(/X/g, '*');
      let result = eval(expression);
      console.log(result);

      setCalc({
        sign: "",
        num: toLocaleString(result),
        res: toLocaleString(result),
      });
    } catch (error) {
      setCalc({
        ...calc,
        res: "Error",
        sign: "",
        num: 0,
      });
    }
  }
};

  //making number positive or negative
  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  //percent click handle
  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  //reset click handle
  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };

  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "=" ? "equals" : ""}
              value={btn}
              onClick={
                btn === "C"
                  ? resetClickHandler
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "."
                  ? commaClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};
export default App;