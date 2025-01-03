
 const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Enregistre un nouvel utilisateur.
 * @async
 * @function register
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
// Fonction d'inscription
exports.register = async (req, res) => { 
  const { name, email, password } = req.body;

  try {
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);
      const user = new User({ name, email, password: hashedPassword });

      // Sauvegarde de l'utilisateur dans la base de données
      const savedUser = await user.save();
      res.status(201).json(savedUser);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};



/**
 * Connecte un utilisateur existant.
 * @async
 * @function login
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Comparaison du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password from request:', password); // Mot de passe fourni
    console.log('Hashed password in DB:', user.password); // Mot de passe haché dans la DB
    console.log('Password match:', isMatch); // Résultat de la comparaison
    
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Génération du token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
    
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

/**
 * Récupère les détails de l'utilisateur connecté.
 * @async
 * @function getUser
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Met à jour un utilisateur par son ID.
 * @async
 * @function updateUser
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (password) user.password = await bcrypt.hash(password, 10); // Hachez le nouveau mot de passe


    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Supprime un utilisateur par son ID.
 * @async
 * @function deleteUser
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère la liste de tous les utilisateurs.
 * @async
 * @function getUsers
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Paramètres de pagination
    const users = await User.find()
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments();
    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};