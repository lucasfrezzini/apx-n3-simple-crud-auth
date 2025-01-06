import express from "express";
import ViteExpress from "vite-express";
import bcrypt from "bcrypt";
import { Auth } from "./src/model/auth";
import { User } from "./src/model/users";

const SECRET_TEXT = "secretText";

const app = express();

app.use(express.json());

User.sync();
Auth.sync();

// signup
app.post("/auth", async (req, res) => {
  try {
    const { name, email, birthdate, password } = req.body;
    // creamos el usuario sino existe
    const [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
        email,
        name,
        birthdate,
      },
    });
    // guardamos la contraseña en otra tabla de la bd
    if (created) {
      await Auth.create({
        email,
        password: await bcrypt.hash(password, 10),
        user_id: user.get("id"), // user.id,
      });
    } else {
      throw new Error("User already exists");
    }

    res.status(201).send({ user, message: "User created successfully" });
  } catch (error: any) {
    res.status(500).json({ Error: error.message });
  }
});

// signin
app.post("/auth/token", async (req, res) => {});

// me

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
