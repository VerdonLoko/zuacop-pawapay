const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Endpoint pour créer une session de paiement PawaPay
app.get("/pawapay/create-session", async (req, res) => {
  // Montant et devise fixés pour l'exemple Congo-Brazzaville
  const payload = {
    depositId: Date.now().toString(), // identifiant unique
    amount: "1500",                   // montant exemple
    currency: "XAF",                  // Franc CFA (Congo-Brazzaville)
    returnUrl: "https://zuacop.com/pawapay/callback", // page de retour après paiement
    statementDescription: "Commande Zuacop"
  };

  try {
    const response = await fetch("https://api.sandbox.pawapay.io/v1/payment_pages", {
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
