const express = require("express");
const app = express();

// Endpoint de retour après paiement
app.get("/pawapay/callback", (req, res) => {
  // PawaPay renvoie généralement des paramètres dans l'URL (status, transactionId, etc.)
  const status = req.query.status || "unknown";
  const transactionId = req.query.transactionId || "N/A";

  if (status === "success") {
    res.send(`
      <h1>Paiement réussi ✅</h1>
      <p>Transaction ID : ${transactionId}</p>
      <p>Merci pour votre achat chez Zuacop.</p>
    `);
  } else if (status === "failed") {
    res.send(`
      <h1>Paiement échoué ❌</h1>
      <p>Transaction ID : ${transactionId}</p>
      <p>Veuillez réessayer ou contacter le support.</p>
    `);
  } else {
    res.send(`
      <h1>Retour de paiement</h1>
      <p>Statut : ${status}</p>
      <p>Transaction ID : ${transactionId}</p>
    `);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Callback en cours sur le port ${port}`);
});
