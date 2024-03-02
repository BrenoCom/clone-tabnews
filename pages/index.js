import { useState } from "react";
export default () => {
  const [beijoCount, setBeijo] = useState(0);

  const renderBeijos = () => {
    let beijos = [];
    for (let i = 1; i < beijoCount; i++) {
      const element = "😘";
      beijos.push(element);
    }
    return beijos;
  };
  return (
    <>
      <h1> Para Gabi </h1>
      <h3> Sei que você ta cansada meu amor </h3>
      <h3> Sei que a faculdade ta difícil</h3>
      <h3> Sei que você ta se esforçando muito no trabalho </h3>
      <h3> Sei que a gente não tem ficado tão grudadinhos </h3>
      <h3>
        Mas já já a gente vai conseguir nossas coisinhas e vamos ficar juntinhos
        🥰
      </h3>
      <h4> Mas se ainda estiver tristinha </h4>
      <h4> Clica no botão para receber muitos beijos 🥰</h4>
      <button onClick={() => setBeijo(beijoCount + 1)}>😍😘</button>
      <br />

      {renderBeijos()}
    </>
  );
};
