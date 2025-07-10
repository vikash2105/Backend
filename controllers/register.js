
export const registerUser = async (req, res) => {
  const { name: userName, email: userEmail, password: userPassword, role: userRole } = req.body;

  if (!userName || !userEmail || !userPassword || !userRole) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const existingUser = await User.findOne({ email: userEmail });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await User.create({
      name: userName,
      email: userEmail,
      password: userPassword,
      role: userRole,
    });

    const token = generateToken(newUser);

    res.status(201).json({ token, user: { id: newUser._id, name: userName, email: userEmail, role: userRole } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
