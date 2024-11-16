import { useEffect, useState } from "react";
import axios from "axios";

import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const PaymentForm = () => {
  const [preferenceId, setPreferenceId] = useState("");

  useEffect(() => {
    initMercadoPago("PUBLIC KEY", {
      locale: "es-AR",
    });

    const createPreference = async () => {
      const items = [
        {
          title: "Producto 1",
          unit_price: 100,
          quantity: 1,
        },
      ];

      try {
        const response = await axios.post(
          "http://localhost:8000/api/create_preference",
          {
            items: items,
          }
        );

        console.log(response.data); // Verifica la estructura de respuesta
        setPreferenceId(response.data.response.id); // Asegúrate de acceder correctamente
      } catch (error) {
        console.error("Error al crear la preferencia:", error);
      }
    };

    createPreference();
  }, []);

  console.log(preferenceId); // Ahora debería mostrar el id correctamente

  return (
    <div>
      {preferenceId ? (
        <Wallet
          initialization={{
            preferenceId,
          }}
          onSuccess={(paymentData) => {
            console.log("Pago exitoso:", paymentData);
          }}
          onError={(errorData) => {
            console.error("Error en el pago:", errorData);
          }}
        />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default PaymentForm;
