import mongoose, { Schema, Document } from 'mongoose';

export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type ItemType = 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'CONSUMABLE';

export interface IItemEffect {
    type: 'XP_BOOST' | 'GOLD_BOOST' | 'DAMAGE_BOOST' | 'SPEED_BOOST' | 'HINT_REVEAL';
    value: number;
}

export interface IItem extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    price: number;
    effects: IItemEffect[];
    iconUrl: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const itemEffectSchema = new Schema<IItemEffect>(
    {
        type: {
            type: String,
            enum: ['XP_BOOST', 'GOLD_BOOST', 'DAMAGE_BOOST', 'SPEED_BOOST', 'HINT_REVEAL'],
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const itemSchema = new Schema<IItem>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['WEAPON', 'ARMOR', 'ACCESSORY', 'CONSUMABLE'],
            required: true,
        },
        rarity: {
            type: String,
            enum: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
            default: 'COMMON',
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        effects: {
            type: [itemEffectSchema],
            default: [],
        },
        iconUrl: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Item = mongoose.model<IItem>('Item', itemSchema);
