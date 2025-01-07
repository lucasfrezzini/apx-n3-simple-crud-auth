import express from "express";
import ViteExpress from "vite-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
app.post("/auth/token", async (req, res) => {
  try {
    const { email, password } = req.body;
    // buscar el usuario a partir de los datos
    const user = await Auth.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // verificamos que la contraseña concuerde con el hash
    const userPassword: string = user.get("password") as string;
    const isValid = await bcrypt.compare(password, userPassword);

    // generamos el token nuevo y lo devolvemos
    if (isValid) {
      const token = jwt.sign(
        {
          user_id: user.get("id"),
        },
        SECRET_TEXT,
        { expiresIn: "1h" }
      );

      res.status(200).send({ token });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error: any) {
    res.status(500).json({ Error: error.message });
  }
});

// middleware validador
function validToken(req: any, res: any, next: any) {
  try {
    // obtenemos el token enviado desde el front
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Token not found");
    }
    // verificamos el token con el secret
    jwt.verify(token, SECRET_TEXT, function (err: any, data: any) {
      if (err) throw new Error("Invalid token");
      req.user_id = data.user_id;
      next();
    });
  } catch (error: any) {
    res.status(401).json({ Error: error.message });
  }
}

// me
app.get("/me", validToken, async (req: any, res: any) => {
  try {
    const user_id = req.user_id;
    const user = await User.findByPk(user_id);
    res.status(200).send({ user });
  } catch (error: any) {
    res.status(500).json({ Error: error.message });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
