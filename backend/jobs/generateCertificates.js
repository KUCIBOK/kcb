const cron = require("node-cron");
const Artwork = require("../models/Artwork");
const {createCertificateForArtwork} = require("../services/documents.service");

// TÂCHE PLANIFIÉE - GÉNÉRER DES CERTIFICATS POUR LES ŒUVRES SANS CERTIFICAT
//Chaque seconde  
cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Running generateCertificates job every day at midnight");
        const artworks = await Artwork.find({ 
            $or: [
            { certificatePath: { $exists: false } },
            { certificatePath: null },
            { certificatePath: "" },
            { certificatePath: "not created" }
            ],
            status: "approved"
        })
        .sort({ createdAt: -1 }) // prend les oeuvres les plus récentes
        .limit(3); // RÉDUIRE À 3 au lieu de 10 pour éviter l'OOM
        
        console.log(`Found ${artworks.length} artworks without certificates`);
        
        // TRAITEMENT SÉQUENTIEL (pas en parallèle) pour éviter la surcharge mémoire
        for (const artwork of artworks) {
            try {
                console.log(`🎨 Génération certificat pour artwork ${artwork._id}...`);
                await createCertificateForArtwork(artwork);
                console.log(`✅ Certificat généré pour artwork ${artwork._id}`);
                
                // FORCER LE GARBAGE COLLECTION après chaque PDF
                if (global.gc) {
                    global.gc();
                    console.log(`🧹 Garbage collection forcé après ${artwork._id}`);
                }
                
                // PAUSE entre chaque génération pour éviter la surcharge
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ Error generating certificate for artwork ${artwork._id}:`, error.message);
                
                // FORCER LE GARBAGE COLLECTION même en cas d'erreur
                if (global.gc) {
                    global.gc();
                }
            }
        }
        
        console.log(`🎉 Job terminé - ${artworks.length} certificats traités`);
        
    } catch (error) {
        console.error("❌ Error in generateCertificates job:", error.message);
    }
});
