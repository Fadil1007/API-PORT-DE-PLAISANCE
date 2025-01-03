const Catway = require('../models/Catway');

/**
 * Crée un nouveau catway.
 * @async
 * @function createCatway
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.createCatway = async (req, res) => {
  const { catwayNumber, type, catwayState } = req.body;
  try {
    const newCatway = new Catway({ catwayNumber, type, catwayState });
    await newCatway.save();
    res.status(201).json(newCatway);
  } catch (error) {
    console.error('Error adding catway:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Récupère tous les catways.
 * @async
 * @function getCatways
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (error) {
    console.error('Error fetching catways:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Récupère un catway par son ID.
 * @async
 * @function getCatway
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getCatway = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).json({ error: 'Catway not found' });
    }
    res.json(catway);
  } catch (error) {
    console.error('Error fetching catway:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Met à jour un catway par son ID.
 * @async
 * @function updateCatway
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.updateCatway = async (req, res) => {
  try {
    const catway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!catway) {
      return res.status(404).json({ error: 'Catway not found' });
    }
    res.json(catway);
  } catch (error) {
    console.error('Error updating catway:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Supprime un catway par son ID.
 * @async
 * @function deleteCatway
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteCatway = async (req, res) => {
  try {
    const catway = await Catway.findByIdAndDelete(req.params.id);
    if (!catway) {
      return res.status(404).json({ error: 'Catway not found' });
    }
    res.json({ message: 'Catway deleted' });
  } catch (error) {
    console.error('Error deleting catway:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};