import mongoose from 'mongoose'

const blockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stackSize: { type: Number, required: false },
    gravity: { type: Boolean, default: false, required: false },
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `http://145.24.223.76:8001/blocks/${ret._id}`,
                },
                collection: {
                    href: `http://145.24.223.76:8001/blocks`
                }
            }
            delete ret._id
        }
    }
});

const Block = mongoose.model('Block', blockSchema);

export default Block;