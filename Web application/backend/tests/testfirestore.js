// testFirestore.js
const db = require('../src/firebase'); // adapte si firebase.js n'est pas dans src/

async function testFirestore() {
  try {
    // Récupérer tous les utilisateurs
    const snapshot = await db.collection('users').get();

    if (snapshot.empty) {
      console.log("Aucun utilisateur trouvé dans Firestore.");
      return;
    }

    console.log("Liste des utilisateurs :");
    snapshot.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Erreur lors de la lecture Firestore :", error.message);
  }
}

testFirestore();
