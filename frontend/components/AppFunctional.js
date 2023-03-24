import axios from 'axios';
import React, { useEffect, useState } from 'react';

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [location, setLocation] = useState({
    x: 2,
    y: 2,
  });

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    if (location.x === 1 && location.y === 1) {
      setIndex(0);
    }
    if (location.x === 2 && location.y === 1) {
      setIndex(1);
    }
    if (location.x === 3 && location.y === 1) {
      setIndex(2);
    }
    if (location.x === 1 && location.y === 2) {
      setIndex(3);
    }
    if (location.x === 2 && location.y === 2) {
      setIndex(4);
    }
    if (location.x === 3 && location.y === 2) {
      setIndex(5);
    }
    if (location.x === 1 && location.y === 3) {
      setIndex(6);
    }
    if (location.x === 2 && location.y === 3) {
      setIndex(7);
    }
    if (location.x === 3 && location.y === 3) {
      setIndex(8);
    }
  }
  useEffect(getXY, [location]);

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setLocation({
      x: 2,
      y: 2,
    })
    setSteps(0);
    setMessage(initialMessage);
    setEmail(initialEmail);
  }

  function changeCoordinate(e) {
    const id = e.target.id;
    if (id === "up" && location.y >= 2) {
      setLocation({ ...location, y: location.y - 1 })
      setMessage(initialMessage)
      setSteps(steps + 1);
    }
    if (id === "up" && location.y <= 1) {
      setMessage("Yukarıya gidemezsiniz");
    }
    if (id === "down" && location.y < 3) {
      setLocation({ ...location, y: location.y + 1 })
      setSteps(steps + 1)
      setMessage(initialMessage);
    }
    if (id === "down" && location.y >= 3) {
      setMessage("Aşağıya gidemezsiniz");
    }
    if (id === "right" && location.x < 3) {
      setLocation({ ...location, x: location.x + 1 })
      setSteps(steps + 1)
      setMessage(initialMessage);
    }
    if (id === "right" && location.x >= 3) {
      setMessage("Sağa gidemezsiniz");
    }
    if (id === "left" && location.x >= 2) {
      setLocation({ ...location, x: location.x - 1 })
      setSteps(steps + 1)
      setMessage(initialMessage);
    }
    if (id === "left" && location.x <= 1) {
      setLocation({ ...location, x: location.x })
      setSteps(steps)
      setMessage("Sola gidemezsiniz");
    }
  }

  function onChange(e) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(e.target.value);
  }

  function onSubmit(e) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    e.preventDefault();
    const toSend = {
      x: location.x,
      y: location.y,
      steps: steps,
      email: email
    }
    
    axios.post("http://localhost:9000/api/result", toSend)
      .then((res) => {
        console.log(res.data);
        setMessage(res.data.message);
        
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data.message);
      })
      .finally(()=>{
        setEmail(initialEmail);
        // setLocation({
        //   x: 2,
        //   y: 2,
        // })
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar ({location.x}, {location.y})</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={changeCoordinate}>SOL</button>
        <button id="up" onClick={changeCoordinate}>YUKARI</button>
        <button id="right" onClick={changeCoordinate}>SAĞ</button>
        <button id="down" onClick={changeCoordinate}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={(e)=>onChange(e)} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
