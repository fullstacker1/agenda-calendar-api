
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: false
    },
    role: {
        type: [String],
        default: ['USER_ROLE'],
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
    },
    isActive: {
        type: Boolean,
        default: true
    }

})

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id
        delete ret.password
    }
})

export const UserModel = mongoose.model('User', userSchema)