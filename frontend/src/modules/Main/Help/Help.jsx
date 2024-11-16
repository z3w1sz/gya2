import { useState } from "react";
import "./styles/Help.css";
import { Link } from "react-router-dom";

export const Help = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Qué formas de pago ofrecen para realizar mi compra?",
      answer: `Transferencia bancaria o depósito bancario.
      Mercado Pago: permite abonar con tarjetas, dinero en tu cuenta de mercado pago o en efectivo en Rapipago o PagoFácil.`,
    },
    {
      question: "¿Cómo se realizan los envíos?",
      answer: `Envìos a domicilio. A traves de medios propios o algun tercero. Ante algún problema no dudes en contactarte con nosotros.`,
    },
    {
      question: "¿Cuánto tarda en llegar el pedido?",
      answer: `El tiempo de entrega dependerá del tipo de envío seleccionado.
      Los envíos tienen una demora aproximada de 2 a 5 días hábiles.`,
    },
    {
      question: "¿Qué materiales trabajan?",
      answer: `Trabajamos accesorios de acero quirúrgico, acero blanco y acero dorado.
      El acero quirúrgico es un material duro y pesado. Su color es gris y es ideal para las que son alérgicas ya que es hipoalergénico. Este material puede mojarse y usarse de forma continua sobre la piel sin alterarse. Sin embargo, el acero blanco y acero dorado, no pueden exponerse a líquidos, perfumes o productos de limpieza, ya que son piezas de acero quirúrgico con un baño de plata u otro metal, que puede alterarse con el uso del accesorio y el tiempo. Si tenés dudas, consultanos como cuidar cada material.`,
    },
    {
      question:
        "¿Qué debo hacer si un producto no llega o no está en buen estado?",
      answer: `Todos nuestros productos cuentan con garantía. Ponete en contacto con nosotros y lo resolveremos de la forma que te sea más conveniente.`,
    },
    {
      question: "¿Cuales son los horarios de atención?",
      answer: `9:00-18:00 Lunes-Martes-Miércoles-Jueves-Viernes
      Tel: 343-4385864 (atención por whatsapp de 10 a 20 hs)`,
    },
  ];

  return (
    <div className="help">
      <div className="faq-container">
        <h2>¿En qué podemos ayudarte?</h2>
        <div className="faq-container__divider-line"></div>
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div
              className={`faq-question ${activeIndex === index ? "open" : ""}`}
              onClick={() => toggleAnswer(index)}
            >
              {faq.question}
              <span className="faq-arrow">▶</span>
            </div>
            <div
              className={`faq-answer ${activeIndex === index ? "show" : ""}`}
            >
              {faq.answer.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        <div className="help-container">
          <h3>¿Necesitás más ayuda?</h3>
          <Link to="/contact">
            <button>Contactanos</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
