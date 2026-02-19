const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const {createError} = require("../middleware/errorHandler");

// ➕ Create artist
const createArtist = async (req, res, next) => {
    try {
        const artist = await Artist.create({
            ...req.body,
            socials:{
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                instagram: req.body.instagram
            },
            userId: req.user._id,
            image : `${req.protocol}://${req.get('host')}/uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${req.file.filename}`,
            createdAt: new Date(),
        });

        res.status(201).json(artist); 
    } catch (error) {
        next(error);
    }
};


// 🔁 Get all artists
const getAllArtists = async (req, res, next) => {
    try {
        const artists = await Artist.find();
        if(artists.length === 0) next(createError.notFound("Aucun artiste trouvé"));
        return res.status(200).json(artists);
    } catch (error) {
        next(error);
    }
};

//Get Artist and update visited count
const getArtistAndUpdateVisited = async (req, res, next) => {
    try {
        const artist = await Artist.findOne({_id : req.params.id});
        if (!artist) next(createError.notFound("Artiste non trouvé"));
        if(artist?.visited === undefined || !artist?.visited) {
            artist.visited = 0;
        }
        artist.visited = artist.visited + 1
        await artist.save();
        res.status(200).json(artist);
    } catch (error) {
        next(error);
    }
}

// 🔎 Get artist by ID
const getArtistById = async (req, res, next) => {
    try {
        const artist = await Artist.findOne({_id : req.params.id});
        if (!artist) next(createError.notFound("Artiste non trouvé"));
        res.status(200).json(artist);
    } catch (error) {
        next(error);
    }
};

const getManagedArtistsByUserId = async (req, res, next) => {
    try {
        const artists = await Artist.find({userId : req.params.id})
        if(artists?.length > 0){
            return res.json(artists)
        }
        next(createError.notFound("Aucun artiste trouvé pour cet utilisateur"))
    } catch (error) {
        next(error);
    }
}

const updateArtist = async (req, res, next) => {
    try {
        const updatedArtist = await Artist.findOneAndUpdate({userId : req.params.id},
        {
            ...req.body,
            socials:{
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                instagram: req.body.instagram
            },
            updatedAt: new Date()
        });
        if (!updatedArtist) {
            next(createError.notFound("Artiste non trouvé"));
        }
        if(req.file){
            updatedArtist.image = `${req.protocol}://${req.get('host')}/uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${req.file?.filename}`
        }
        else{
            updatedArtist.image = req.body.image
        }
        await updatedArtist.save()
        await Artwork.updateMany({artistId : req.params.id}, {
        artist: req.body.name}, {multi: true});
        res.status(200).json(updatedArtist);
    } catch (error) {
        next(error);
    }
};

const updateManagedArtist = async (req, res, next) => {
    try {
        const updatedArtist = await Artist.findOneAndUpdate({_id : req.params.id},
            {
                ...req.body,
                image: req.file?.filename ? `${req.protocol}://${req.get('host')}/uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${req.file?.filename}` : `${req.body?.image}` || '',
                updatedAt: new Date()
            }
        );
        await Artwork.updateMany({artistId : req.params.id}, {
            artist: req.body.name}, {multi: true});
        if (!updatedArtist) {
            next(createError.notFound("Artiste non trouvé"));
        }

        res.status(200).json(updatedArtist);
    } catch (error) {
        next(error);
    }
};


const deleteArtist = async (req, res, next) => {
    try {
        const deletedArtist = await Artist.findOneAndDelete({_id : req.params.id});
        if (!deletedArtist) {
            next(createError.notFound("Artiste non trouvé"));
        }
        res.status(200).json({ message: 'Artiste supprimé avec succès' });
    } catch (error) {
        next(error);
    }
};

const deleteAll = async (req, res, next) => {
    try {
        await Artist.deleteMany()
        res.status(200).json({ message: 'Tous les artistes ont été supprimés avec succès' });
    } catch (error) {
        next(error);
    }
}

const getRandomArtists = async (req, res, next) => {
    try {
        const artists = await Artist.aggregate([{ $sample: { size: 16 } }]);
        if (artists?.length >= 1) {
            return res.status(200).json(artists);
        }
        next(createError.notFound("Aucun artiste trouvé"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createArtist,
    getAllArtists,
    getArtistById,
    getManagedArtistsByUserId,
    updateArtist,
    deleteArtist,
    getRandomArtists,
    getArtistAndUpdateVisited,
    updateManagedArtist,
    deleteAll
};
