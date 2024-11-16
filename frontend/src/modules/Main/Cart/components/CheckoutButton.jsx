import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import axios from "axios";

initMercadoPago("TEST-42bf0ad1-91c7-41c8-a6ee-75c6f8867cf0", {
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
