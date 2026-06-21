const Submission = require('../models/Submission');
const User = require('../models/User');

exports.submitPhase = async (req, res) => {
  try {
    const { phase, answers, score } = req.body;
    const userId = req.user.id;

    // Guardar o actualizar la respuesta de esta fase para el usuario
    let submission = await Submission.findOne({ userId, phase });
    
    if (submission) {
      submission.answers = answers;
      submission.score = score;
      submission.submittedAt = Date.now();
      await submission.save();
    } else {
      submission = await Submission.create({
        userId,
        phase,
        answers,
        score
      });
    }

    res.json({ message: 'Respuestas guardadas exitosamente', submission });
  } catch (error) {
    console.error('Error guardando respuestas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    // Solo admins deberían llamar esto (verificado en rutas/middleware)
    const submissions = await Submission.find().populate('userId', 'username role');
    res.json(submissions);
  } catch (error) {
    console.error('Error obteniendo resultados:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await Submission.find({ userId });
    res.json(submissions);
  } catch (error) {
    console.error('Error obteniendo mis resultados:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
