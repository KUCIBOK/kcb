#!/usr/bin/env node

/**
 * Script: Import Missira Keita's portfolio into Kucibok
 * Creates user account + artist profile + 9 sculptures
 */

const { createClient } = require("@supabase/supabase-js");

// Credentials from .env.production.local
const SUPABASE_URL = "https://wyrmpddlhldjzoiwbshj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cm1wZGRsaGxkanpvaXdic2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjcwNjA0NywiZXhwIjoyMDg4MjgyMDQ3fQ.QQ6Bt-Tk5Vm_Lp8zD1SewXFgPRHGZgvA2v6zj87ijqs";

const SCULPTURE_CATEGORY_ID = "e775ce93-4238-49df-b3e2-a738a9b46c06";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Artist info
const ARTIST_EMAIL = "missirakeita@gmail.com";
const ARTIST_NAME = "Missira Keita";
const ARTIST_BIO = `L'envie de matérialiser un carrefour de rencontre m'a conduite à réaliser des sculptures animées d'environ 2m de haut où le fer, la brique, le carreau se portent, s'imbriquent, se traversent et s'empilent.
Chaque matériau terre utilisé dans ces sculptures possède une histoire, une forme, une couleur, une présence, qui sont pour moi des sources d'inspiration.
Au fil de mes pensées, l'acier utilisé est assemblée, torsade, déformé pour donner de la voix à cette matière qui fut un tout et qui devient désormais UN.

Un voyage vers un nouveau cycle de la vie de la matière !
Un voyage pour aller à la rencontre de l'autre !
Un voyage dans le temps !
Un voyage pour rester Vivant !
Telle est la portée de ce projet, UN`;

// Sculptures data
const sculptures = [
  {
    title: "EXPLORATEUR",
    description:
      "Des bouts d'écharpe du Petit Prince qui prennent leur envol.",
    materials: "Chutes de fer recyclées et brique de terre cuite récupérée",
    height: "2,10 m",
    width: "1,90 m",
    location: "Sénégal",
    creation_date: "2024-06-01",
    price: 600000,
    currency: "FCFA",
    status: "available",
  },
  {
    title: "LA CROISÉE DES CHEMINS",
    description: "Des chemins de vie qui se croisent",
    materials: "Chutes de fer recyclées et briquettes de récupération",
    height: "1,70 m",
    width: "0,63 m",
    location: "Sénégal",
    creation_date: "2024-08-01",
    price: 300000,
    currency: "FCFA",
    status: "available",
  },
  {
    title: "L'EVEILLE",
    description:
      "Des ondes de communication qui se croisent et s'entrecroisent pour se mêler et circuler, un Tout.",
    materials: "Récupération d'acier recyclés avec briquettes de chutes",
    height: "2,10 m",
    width: "1 m",
    location: "Sénégal",
    creation_date: "2024-05-01",
    price: 400000,
    currency: "FCFA",
    status: "available",
  },
  {
    title: "JEUX OUVERTS",
    description:
      "L'effervescence autour de cet évènement placé sous le signe de l'effort et des valeurs de l'olympisme ! Le sablier inversé au centre représente la montée des marches vers les Jeux Olympiques de la Jeunesse.",
    materials: "Récupération de fer recyclées et un carreau de chute",
    height: "2 m",
    width: "1,20 m",
    location: "Sénégal",
    creation_date: "2024-01-01",
    price: 600000,
    currency: "FCFA",
    status: "available",
  },
  {
    title: "TROIS DIMENSIONS",
    description: "Des espaces temps qui défient le temps",
    materials: "Chutes de fer recyclées et une brique en terre cuite récupérée",
    height: "2 m",
    width: "1,05 m",
    location: "Sénégal",
    creation_date: "2024-08-01",
    price: 500000,
    currency: "FCFA",
    status: "available",
  },
  {
    title: "EVOLTERRE",
    description:
      "L'évolution de l'homme qui porte à bout de bras cette terre et aspire à l'élever au niveau de son regard pour la préserver",
    materials: "Chutes de fer recyclées et brique de terre cuite",
    height: "2,15 m",
    width: "1,14 m",
    location: "Sénégal",
    creation_date: "2024-02-01",
    price: 400000,
    currency: "FCFA",
    status: "sold",
  },
  {
    title: "LE TOURNIS",
    description: "Inspiration ondulée du moment",
    materials: "Chutes d'acier recyclées, torsadées et plots en latérite",
    height: "1,60 m",
    width: "1,18 m",
    location: "Sénégal",
    creation_date: "2024-11-01",
    price: 600000,
    currency: "FCFA",
    status: "available",
  },
  {
    title: "DO RE MI",
    description: "Grandir, se grandir et redoubler d'effort",
    materials: "Chutes de fer recyclées et carreaux récupérés",
    height: "1,97 m",
    width: "0,75 m",
    location: "Sénégal",
    creation_date: "2024-04-01",
    price: 500000,
    currency: "FCFA",
    status: "available",
  },
  {
    title: "CE QUE L'ÊTRE !",
    description:
      "Une colonne vertébrale bien ancrée qui cherche un équilibre tout au long de son existence.",
    materials: "Chutes de fer recyclées et briquettes de récupération",
    height: "2,50 m",
    width: "0,90 m",
    location: "Sénégal",
    creation_date: "2024-01-01",
    price: 1500000,
    currency: "FCFA",
    status: "available",
  },
];

async function main() {
  console.log("🎨 Importing Missira Keita's portfolio...\n");

  try {
    // Step 1: Check if user exists
    console.log(`1️⃣  Checking if ${ARTIST_EMAIL} exists...`);
    const { data: existingUsers, error: userCheckError } = await supabase.auth.admin.listUsers();

    if (userCheckError) {
      throw new Error(`Failed to list users: ${userCheckError.message}`);
    }

    let userId = null;
    const existingUser = existingUsers.users.find((u) => u.email === ARTIST_EMAIL);

    if (existingUser) {
      console.log(`   ✅ User already exists: ${existingUser.id}`);
      userId = existingUser.id;
    } else {
      // Create user
      console.log(`   ❌ User does not exist. Creating...`);
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: ARTIST_EMAIL,
        password: "GeneratedPassword123!", // Temporary, user can reset
        email_confirm: true,
        user_metadata: {
          first_name: ARTIST_NAME,
        },
      });

      if (createUserError) {
        throw new Error(`Failed to create user: ${createUserError.message}`);
      }

      userId = newUser.user.id;
      console.log(`   ✅ User created: ${userId}`);
    }

    // Step 2: Ensure user record exists in users table
    console.log(`\n2️⃣  Checking user profile in database...`);
    const { data: userProfile } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!userProfile) {
      console.log(`   ℹ️  Creating user record...`);
      const { error: insertUserError } = await supabase.from("users").insert({
        id: userId,
        name: ARTIST_NAME,
        username: ARTIST_NAME.toLowerCase().replace(/\s+/g, "_"),
        role: "artist",
        country: "Sénégal",
        is_active: true,
        profile_completed: true,
        onboarding_completed: true,
      });

      if (insertUserError) {
        console.warn(`   ⚠️  User record error: ${insertUserError.message}`);
      } else {
        console.log(`   ✅ User record created`);
      }
    } else {
      console.log(`   ✅ User profile exists`);
    }

    // Step 3: Create/update artist profile
    console.log(`\n3️⃣  Setting up artist profile...`);
    const { data: artistProfile } = await supabase
      .from("artists")
      .select("id")
      .eq("user_id", userId)
      .single();

    let artistId;
    if (!artistProfile) {
      console.log(`   ℹ️  Creating artist profile...`);
      const { data: newArtist, error: createArtistError } = await supabase
        .from("artists")
        .insert({
          user_id: userId,
          name: ARTIST_NAME,
          username: ARTIST_NAME.toLowerCase().replace(/\s+/g, "_"),
          biography: ARTIST_BIO,
          country: "Sénégal",
          disciplines: ["Sculpture"],
          artistic_statement:
            "Utilisation de matériaux recyclés pour créer des rencontres",
          market_presence: "Sénégal, Afrique de l'Ouest",
        })
        .select()
        .single();

      if (createArtistError) {
        throw new Error(`Failed to create artist profile: ${createArtistError.message}`);
      }

      artistId = newArtist.id;
      console.log(`   ✅ Artist profile created: ${artistId}`);
    } else {
      artistId = artistProfile.id;
      console.log(`   ✅ Artist profile exists: ${artistId}`);
    }

    // Step 4: Add sculptures
    console.log(`\n4️⃣  Importing ${sculptures.length} sculptures...`);

    for (let i = 0; i < sculptures.length; i++) {
      const sculpture = sculptures[i];
      console.log(
        `   [${i + 1}/${sculptures.length}] Adding "${sculpture.title}"...`
      );

      // Parse dimensions: "2,10 m" -> 2.10
      const parseHeight = (str) =>
        parseFloat(str.replace(/\s*m\s*$/, "").replace(",", "."));

      const { error: insertError } = await supabase.from("artworks").insert({
        user_id: userId,
        artist_id: artistId,
        title: sculpture.title,
        description: sculpture.description,
        category: "sculpture",
        medium: sculpture.materials,
        height: parseHeight(sculpture.height),
        width: parseHeight(sculpture.width),
        price: sculpture.price,
        currency: sculpture.currency,
        status: "approved",  // ✅ FIX: Use 'approved' (not 'available')
        for_sale: sculpture.status === "available",
        sold: sculpture.status === "sold",
        category_id: SCULPTURE_CATEGORY_ID,
      });

      if (insertError) {
        console.warn(`   ⚠️  Error adding "${sculpture.title}": ${insertError.message}`);
      } else {
        console.log(`   ✅ "${sculpture.title}" added`);
      }
    }

    console.log("\n✨ Import complete!");
    console.log(`\n📊 Summary:`);
    console.log(`   • User: ${ARTIST_EMAIL}`);
    console.log(`   • Artist: ${ARTIST_NAME}`);
    console.log(`   • Sculptures: ${sculptures.length}`);
    console.log(`   • Status: Ready for approval`);
    console.log(
      `\n🔗 Dashboard: https://kucibok.com/admin/artworks?artist=${userId}`
    );
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    process.exit(1);
  }
}

main();
