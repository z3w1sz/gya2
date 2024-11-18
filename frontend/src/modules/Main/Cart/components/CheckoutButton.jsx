import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import axios from "axios";

initMercadoPago("APP_USR-254ae5f4-0ef9-4dbb-8f28-9826f79049de", {
  locale: "es-AR",
});

const CheckoutButton = ({ orderData }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const { productsUrl } = useBaseUrl();

  // Usamos useEffect para crear la preferencia solo una vez
  useEffect(() => {
    if (orderData && !preferenceId) {
      axios
        .post(productsUrl + "/create_preference", orderData)
        .then((response) => {
          setPreferenceId(response.data.preference_id);
        })
        .catch((error) =>
          console.error("Error al crear la preferencia:", error)
        );
    }
  }, [orderData, preferenceId]); // Solo se ejecuta si orderData o preferenceId cambian

  return (
    <>
      {preferenceId ? (
        <Wallet initialization={{ preferenceId: preferenceId }} />
      ) : (
        <p>Generando preferencia...</p> // Puedes mostrar un mensaje de carga si lo deseas
      )}
    </>
  );
};

export default CheckoutButton;
