import { bcryptAdapter } from "../../config/bcrypt";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data/models/usuarios.model";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { RegisterRouterDto } from "../../domain/dtos/auth/register-user-dto";
import { CustomError } from "../../domain/entities/errors/customErrors";
import { UserEntity } from "../../domain/entities/user.entity";


export class AuthService {

    constructor() { }

    public async registerUser(registerUserDto: RegisterRouterDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email })
        if (existUser) throw CustomError.badRequest('email already exist')

        try {

            const user = new UserModel(registerUserDto)

            console.log(bcryptAdapter.hash(registerUserDto.name));
            console.log(bcryptAdapter.hash(registerUserDto.email));

            user.password = bcryptAdapter.hash(registerUserDto.password)

            await user.save()

            const { password, ...userEntity } = UserEntity.fromObject(user)

            const token = await JwtAdapter.generateToken({ id: userEntity.id })
            if (!token) throw CustomError.internalServerError('error generating token');

            return {
                user: userEntity,
                token: token
            }

        } catch (error) {
            throw CustomError.internalServerError(`${error}`)
        }

    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email })
        if (!user) throw CustomError.notFound('user not found');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password)
        if (!isMatching) throw CustomError.unauthorized('invalid credentials');

        const { password, ...userEntity } = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({ id: userEntity.id })
        if (!token) throw CustomError.internalServerError('error generating token');

        return {
            user: userEntity,
            token: token
        }

    }

}