
import mongoose from 'mongoose'

const calendarSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'name is required']
    },
    color: {
        type: String,
        required: [true, 'color is required']
    },
    is_Public: {
        type: Boolean,
        default: true
    }

})



export const CalendarModel = mongoose.model('Calendar', calendarSchema)