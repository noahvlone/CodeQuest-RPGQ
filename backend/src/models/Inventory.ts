import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
    _id: mongoose.Types.ObjectId;
    characterId: mongoose.Types.ObjectId;
    itemId: mongoose.Types.ObjectId;
    quantity: number;
    isEquipped: boolean;
    acquiredAt: Date;
}

const inventorySchema = new Schema<IInventoryItem>(
    {
        characterId: {
            type: Schema.Types.ObjectId,
            ref: 'Character',
            required: true,
        },
        itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },
        isEquipped: {
            type: Boolean,
            default: false,
        },
        acquiredAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique inventory item per character
inventorySchema.index({ characterId: 1, itemId: 1 }, { unique: true });

export const Inventory = mongoose.model<IInventoryItem>('Inventory', inventorySchema);
