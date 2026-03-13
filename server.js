const express = require("express");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Endpoint pour créer une session de paiement PawaPay
app.get("/pawapay/create-session", async (req, res) => {
  // Montant et devise fixés pour l'exemple Congo-Brazzaville
  const payload = {
    depositId: uuidv4(), // identifiant unique
    returnUrl: "https://zuacop.com/pawapay/callback", // page de retour après paiement
    customerMessage: "Paiement Zuacop",
    amountDetails: {
    amount: "1500",
    currency: "XAF"
    },
    phoneNumber: "242053456789", // numéro test sandbox
    language:"FR",
    country: "COG",                     // code ISO du Congo-Brazzaville
    reason: "Test paie ZuaCop",
    metadata: [
      {orderId: "ORD-123456789},
      {customerId: "ARTAXUS"}
    ]
  };

  try {
    const response = await fetch("https://api.sandbox.pawapay.io/v1/widget/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PAWAPAY_KEY}`, // clé API stockée dans Render
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.redirectUrl) {
      // Redirection vers la Payment Page PawaPay
      res.redirect(data.redirectUrl);
    } else {
      res.status(400).send("Erreur de création de paiement : " + JSON.stringify(data));
    }
  } catch (error) {
    res.status(500).send("Erreur serveur : " + error.message);
  }
});

// Lancement du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en cours sur le port ${port}`);
});
