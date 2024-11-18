import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import axios from "axios";

initMercadoPago("APP_USR-254ae5f4-0ef9-4dbb-8f28-9826f79049de", {
  locale: "es-AR",
});

const CheckoutButton = ({ orderData }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const { productsUrl } = useBaseUrl();

  // Asegurarse de que la preferencia solo se cree una vez
  useEffect(() => {
    if (orderData && !preferenceId) {
      // Solo crea la preferencia si no existe ya
      setLoading(true); // Inicia el estado de carga
      axios
        .post(productsUrl + "/create_preference", orderData)
        .then((response) => {
          setPreferenceId(response.data.preference_id);
          setLoading(false); // Finaliza el estado de carga
        })
        .catch((error) => {
          setError("Error al crear la preferencia: " + error.message); // Establece el error
          setLoading(false); // Finaliza el estado de carga
        });
    }
  }, [orderData, preferenceId, productsUrl]); // Solo ejecuta si orderData o preferenceId cambian

  if (loading) {
    return <p>Cargando preferencia de pago...</p>; // Muestra un mensaje de carga mientras se genera la preferencia
  }

  if (error) {
    return <p>{error}</p>; // Muestra el error si no se puede crear la preferencia
  }

  return (
    <>
      {preferenceId ? (
        // El Wallet solo se renderiza si ya se ha generado la preferencia
        <Wallet initialization={{ preferenceId: preferenceId }} />
      ) : (
        <p>No se pudo generar el botón de pago. Intenta nuevamente.</p>
      )}
    </>
  );
};

export default CheckoutButton;
