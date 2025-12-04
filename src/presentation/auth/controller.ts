import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CustomError } from "../../domain/entities/errors/customErrors";
import { RegisterRouterDto } from "../../domain/dtos/auth/register-user-dto";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";

export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  private handleError(error: unknown, res: Response) {

    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    
    return res.status(500).json({ message: 'Internal Server Error' });

  }

  registerUser = (req: Request, res: Response) => {

    const [error, registerUserDto] = RegisterRouterDto.create(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    this.authService.registerUser(registerUserDto!)
      .then((user) => {res.json(user) }  )
      .catch((error) => this.handleError(error, res));

  }

  loginUser = (req: Request, res: Response) => {

    const [error, loginUserDto] = LoginUserDto.login(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    this.authService.loginUser(loginUserDto!)
      .then((user) => { res.json(user) })
      .catch((error) => this.handleError(error, res));

  }

}