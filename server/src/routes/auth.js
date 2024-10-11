import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser } from '../controllers/user';

const router = Router();
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
  res.json({ token });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = await createUser({ email, password: hashedPassword });

  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
  res.json({ token });
});

export default router;