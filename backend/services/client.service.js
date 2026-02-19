const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Client = require("../models/Client");

// Fonction pour valider et nettoyer les numéros de téléphone
const validateAndCleanPhone = (phone) => {
  if (!phone || typeof phone !== "string") return undefined;

  const cleaned = phone.trim();
  if (cleaned === "") return undefined;

  // Vérifier si le numéro contient seulement des caractères valides
  const phoneRegex = /^[\d\s+\-()]+$/;
  if (!phoneRegex.test(cleaned)) {
    console.warn(`Numéro de téléphone invalide ignoré: ${phone}`);
    return undefined; // Ignorer les numéros invalides
  }

  return cleaned;
};

// Service pour traiter l'upload de fichiers clients
const processClientFileUpload = async (file, userId) => {
  const ext = path.extname(file.originalname).toLowerCase();
  let data = [];

  // Traitement selon le type de fichier
  if (ext === ".xlsx") {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else if (ext === ".csv") {
    // Détecter automatiquement le séparateur
    const firstLine = fs.readFileSync(file.path, "utf8").split("\n")[0];
    let separator = "\t"; // Par défaut tabulation (Excel)

    if (firstLine.includes(";") && !firstLine.includes("\t")) {
      separator = ";";
    } else if (
      firstLine.includes(",") &&
      !firstLine.includes("\t") &&
      !firstLine.includes(";")
    ) {
      separator = ",";
    }

    console.log(
      "Séparateur détecté:",
      separator === "\t" ? "tabulation" : separator
    );

    const rows = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv({ separator }))
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
    data = rows;
  } else {
    throw new Error("Format de fichier non supporté.");
  }

  // Nettoyer le fichier temporaire
  fs.unlinkSync(file.path);

  console.log("Données brutes extraites:", data);
  console.log("Premier échantillon:", data[0]);

  const normalizeKey = (key) => key?.toLowerCase()?.trim();
  const sample = data[0];
  const headers = Object.keys(sample).map(normalizeKey);

  console.log("Headers détectés:", headers);
  console.log("Sample:", sample);

  const hasGroupedField = headers.length === 1 && headers[0].includes(";");
  let clients = [];

  if (hasGroupedField) {
    // Cas particulier : un seul champ contenant tout
    const mainKey = Object.keys(sample)[0];
    clients = data.map((row) => {
      const values = row[mainKey].split(";");
      return {
        nom: values[0]?.trim(),
        prenom: values[1]?.trim(),
        email: values[2]?.trim(),
        telephone: validateAndCleanPhone(values[3]),
        ville: values[4]?.trim(),
        artistId: userId || new mongoose.Types.ObjectId(),
      };
    });
  } else {
    // Cas normal : colonnes bien séparées
    console.log(
      "Clés disponibles dans la première ligne:",
      Object.keys(sample)
    );

    clients = data.map((row) => {
      const keys = Object.keys(row);
      console.log("Clés exactes pour cette ligne:", keys);

      // Fonction pour trouver une clé qui correspond (insensible à la casse et aux guillemets)
      const normalize = (str) =>
        str
          ?.toLowerCase()
          ?.normalize("NFD")
          ?.replace(/[\u0300-\u036f]/g, "") // supprime les accents
          ?.replace(/['"\s]/g, ""); // supprime quotes + espaces

      const findKey = (searchTerms) => {
        for (const term of searchTerms) {
          const termNorm = normalize(term);
          for (const key of keys) {
            const keyNorm = normalize(key);
            if (keyNorm === termNorm) {
              return key;
            }
          }
        }
        return null;
      };

      const nomKey = findKey(["Nom", "nom", "NOM"]);
      const prenomKey = findKey(["Prénom", "prenom", "Prenom", "PRENOM"]);
      const emailKey = findKey(["Email", "email", "EMAIL"]);
      const telephoneKey = findKey([
        "Téléphone",
        "telephone",
        "Telephone",
        "TELEPHONE",
      ]);
      const villeKey = findKey(["Ville", "ville", "VILLE"]);

      const client = {
        nom: nomKey ? row[nomKey] : undefined,
        prenom: prenomKey ? row[prenomKey] : undefined,
        email: emailKey ? row[emailKey] : undefined,
        telephone: telephoneKey
          ? validateAndCleanPhone(row[telephoneKey])
          : undefined,
        ville: villeKey ? row[villeKey] : undefined,
        artistId: userId || new mongoose.Types.ObjectId(),
      };

      console.log("Mapping pour une ligne:", {
        input: row,
        keysFound: { nomKey, prenomKey, emailKey, telephoneKey, villeKey },
        output: client,
      });

      return client;
    });
  }

  console.log(
    "Clients après mapping:",
    JSON.stringify(clients.slice(0, 2), null, 2)
  );

  return await processClientDuplicates(clients);
};

// Service pour gérer les doublons et insérer les clients
const processClientDuplicates = async (clients) => {
  // Filtrer les clients avec des données valides avant de traiter les doublons
  const validClients = clients.filter((client) => {
    // Vérifier que le client a au minimum nom, prénom et email
    return client.nom && client.prenom && client.email;
  });

  console.log(
    `${clients.length} clients extraits, ${validClients.length} valides`
  );

  const uniqueClients = [];
  const seenEmails = new Set();
  const seenPhones = new Set();
  const duplicates = [];

  for (const client of validClients) {
    let isDuplicate = false;

    if (client.email && seenEmails.has(client.email)) {
      duplicates.push(`Email en doublon dans le fichier: ${client.email}`);
      isDuplicate = true;
    }

    if (client.telephone && seenPhones.has(client.telephone)) {
      duplicates.push(
        `Téléphone en doublon dans le fichier: ${client.telephone}`
      );
      isDuplicate = true;
    }

    if (!isDuplicate) {
      if (client.email) seenEmails.add(client.email);
      if (client.telephone) seenPhones.add(client.telephone);
      uniqueClients.push(client);
    }
  }

  const emailsToCheck = uniqueClients.map((c) => c.email).filter(Boolean);
  const phonesToCheck = uniqueClients.map((c) => c.telephone).filter(Boolean);

  const existingByEmail = await Client.find({
    email: { $in: emailsToCheck },
  });
  const existingByPhone = await Client.find({
    telephone: { $in: phonesToCheck },
  });

  const existingEmails = new Set(existingByEmail.map((c) => c.email));
  const existingPhones = new Set(existingByPhone.map((c) => c.telephone));

  const finalClients = uniqueClients.filter((client) => {
    if (client.email && existingEmails.has(client.email)) {
      duplicates.push(`Email déjà existant: ${client.email}`);
      return false;
    }
    if (client.telephone && existingPhones.has(client.telephone)) {
      duplicates.push(`Téléphone déjà existant: ${client.telephone}`);
      return false;
    }
    return true;
  });

  await Client.insertMany(finalClients);

  console.log(
    "Clients finalement insérés:",
    JSON.stringify(finalClients.slice(0, 2), null, 2)
  );

  let message = `${finalClients.length} clients importés avec succès.`;
  if (duplicates.length > 0) {
    message += ` ${duplicates.length} doublons ignorés.`;
  }

  return {
    message,
    imported: finalClients.length,
    duplicates: duplicates.length,
    duplicateDetails: duplicates,
  };
};

// Service pour valider les données d'un client
const validateClientData = (clientData) => {
  const { nom, prenom, email, telephone } = clientData;

  if (!nom || !prenom || !email) {
    throw new Error("Nom, prénom et email sont requis.");
  }

  // Validation du format du numéro de téléphone
  if (telephone && telephone.trim() !== "") {
    const phoneRegex = /^[\d\s+\-()]+$/;
    if (!phoneRegex.test(telephone.trim())) {
      throw new Error(
        "Le numéro de téléphone ne peut contenir que des chiffres, espaces, +, - et parenthèses."
      );
    }
  }

  return true;
};

// Service pour vérifier les doublons lors de l'ajout d'un client
const checkClientDuplicates = async (email, telephone, excludeId = null) => {
  if (email) {
    const query = { email };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existingEmail = await Client.findOne(query);
    if (existingEmail) {
      throw new Error("Un client avec cet email existe déjà.");
    }
  }

  if (telephone && telephone.trim() !== "") {
    const query = { telephone: telephone.trim() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existingPhone = await Client.findOne(query);
    if (existingPhone) {
      throw new Error("Un client avec ce numéro de téléphone existe déjà.");
    }
  }
};

module.exports = {
  processClientFileUpload,
  processClientDuplicates,
  validateClientData,
  checkClientDuplicates,
  validateAndCleanPhone,
};