import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import axios from "axios";

initMercadoPago("APP_USR-254ae5f4-0ef9-4dbb-8f28-9826f79049de", {
  locale: "es-AR",
}); // Reemplaza con tu Public Key

const CheckoutButton = ({ orderData }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const { productsUrl } = useBaseUrl();

  useEffect(() => {
    axios
      .post(productsUrl + "/create_preference", orderData)
      .then((response) => setPreferenceId(response.data.preference_id))
      .catch((error) => console.error("Error al crear la preferencia:", error));
  }, [orderData]);

  return (
    <>
      {preferenceId && (
        <Wallet initialization={{ preferenceId: preferenceId }} />
      )}
    </>
  );
};

export default CheckoutButton;
