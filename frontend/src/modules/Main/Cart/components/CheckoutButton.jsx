import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { useBaseUrl } from "../../../../context/BaseUrlContext";

initMercadoPago("APP_USR-254ae5f4-0ef9-4dbb-8f28-9826f79049de", {
  locale: "es-AR",
});

const CheckoutButton = ({ orderData }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const { productsUrl } = useBaseUrl();

  // Solo crear la preferencia una vez
  useEffect(() => {
    if (!preferenceId && orderData) {
      axios
        .post(productsUrl + "/create_preference", orderData)
        .then((response) => {
          setPreferenceId(response.data.preference_id); // Solo actualiza si se recibe un preferenceId
        })
        .catch((error) => {
          console.error("Error al crear la preferencia", error);
        });
    }
  }, [orderData, preferenceId, productsUrl]);

  if (!preferenceId) {
    return <p>Cargando el botón de pago...</p>; // Mensaje mientras se genera la preferencia
  }

  return (
    // Renderiza Wallet solo cuando preferenceId esté disponible
    <Wallet initialization={{ preferenceId }} />
  );
};

export default CheckoutButton;
