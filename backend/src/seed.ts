import mongoose from 'mongoose';
import { env } from './config/env.js';
import { Challenge } from './models/Challenge.js';
import { Item } from './models/Item.js';

// --- HELPER: Random Generator ---
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// --- CONSTANTS ---
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as const;
const ROLES = [
    'FRONTEND_WARRIOR', 'BACKEND_MAGE', 'FULLSTACK_RANGER',
    'NEURAL_HACKER', 'QUANTUM_ARCHITECT', 'CLOUD_PHANTOM',
    'CIPHER_GUARDIAN', 'PIXEL_RONIN'
] as const;

// --- CHALLENGE GENERATORS ---

const generateSyntaxChallenge = (role: string, difficulty: string, index: number) => {
    const operations = ['sum', 'product', 'difference', 'average'];
    const op = getRandomElement(operations);
    const n = getRandomInt(2, 5);

    return {
        title: `Syntax Protocol ${index + 1}: ${op.toUpperCase()}`,
        description: `Create a function that calculates the ${op} of ${n} numbers.`,
        narrative: `The ${role} must master basic operations to stabilize the core.`,
        difficulty,
        category: 'SYNTAX',
        language: 'javascript',
        starterCode: `function solve(input) {\n  // Calculate ${op}\n}`,
        solutionCode: `function solve(input) { return 0; } // Placeholder`,
        testCases: [{ input: '[1,2]', expectedOutput: '3', isHidden: false }],
        xpReward: 100 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        goldReward: 50 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        requiredLevel: DIFFICULTIES.indexOf(difficulty as any) + 1,
        order: index + 1,
        targetClasses: [role],
    };
};

const generateAlgorithmChallenge = (role: string, difficulty: string, index: number) => {
    return {
        title: `Algorithm Nexus ${index + 1}: Optimization`,
        description: `Optimize an array processing algorithm for O(n) complexity.`,
        narrative: `Efficiency is key for a ${role}. Optimize the data stream.`,
        difficulty,
        category: 'ALGORITHMS',
        language: 'javascript',
        starterCode: `function solve(arr) {\n  // Optimize me\n}`,
        solutionCode: `function solve(arr) { return arr; }`,
        testCases: [{ input: '[1,2,3]', expectedOutput: '[1,2,3]', isHidden: false }],
        xpReward: 200 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        goldReward: 100 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        requiredLevel: DIFFICULTIES.indexOf(difficulty as any) + 2,
        order: index + 100,
        targetClasses: [role],
    };
};

const generateDataChallenge = (role: string, difficulty: string, index: number) => {
    return {
        title: `Data Stream ${index + 1}: Analysis`,
        description: `Analyze a dataset of ${getRandomInt(10, 100)} records and find the outlier.`,
        narrative: `Neural patterns indicate an anomaly. ${role}, find it.`,
        difficulty,
        category: 'DATA_SCIENCE',
        language: 'python',
        starterCode: `def solve(data):\n  # Find outlier\n  pass`,
        solutionCode: `def solve(data):\n  return data[0]`,
        testCases: [{ input: '[1,1,1,2]', expectedOutput: '2', isHidden: false }],
        xpReward: 250 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        goldReward: 125 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        requiredLevel: DIFFICULTIES.indexOf(difficulty as any) + 2,
        order: index + 200,
        targetClasses: [role],
    };
};

const generateSecurityChallenge = (role: string, difficulty: string, index: number) => {
    return {
        title: `Security Breach ${index + 1}: Encryption`,
        description: `Implement a basic hashing algorithm using shift and rotate.`,
        narrative: `The firewall is failing. ${role}, secure the breach.`,
        difficulty,
        category: 'SECURITY',
        language: 'javascript',
        starterCode: `function solve(payload) {\n  // Hash it\n}`,
        solutionCode: `function solve(payload) { return payload; }`,
        testCases: [{ input: '"secret"', expectedOutput: '"hashed"', isHidden: false }],
        xpReward: 300 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        goldReward: 150 * (DIFFICULTIES.indexOf(difficulty as any) + 1),
        requiredLevel: DIFFICULTIES.indexOf(difficulty as any) + 3,
        order: index + 300,
        targetClasses: [role],
    };
};

// --- MAIN GENERATION LOOP ---
const generateAllChallenges = () => {
    const allChallenges = [];

    for (const role of ROLES) {
        // Generate 25 Syntax Challenges (Easy/Medium)
        for (let i = 0; i < 25; i++) {
            allChallenges.push(generateSyntaxChallenge(role, i < 15 ? 'EASY' : 'MEDIUM', i));
        }

        // Generate 25 Algorithm Challenges (Medium/Hard)
        for (let i = 0; i < 25; i++) {
            allChallenges.push(generateAlgorithmChallenge(role, i < 15 ? 'MEDIUM' : 'HARD', i));
        }

        // Generate 25 Domain-Specific Challenges (Hard/Expert)
        for (let i = 0; i < 25; i++) {
            if (role === 'NEURAL_HACKER' || role === 'QUANTUM_ARCHITECT') {
                allChallenges.push(generateDataChallenge(role, i < 10 ? 'HARD' : 'EXPERT', i));
            } else if (role === 'CIPHER_GUARDIAN') {
                allChallenges.push(generateSecurityChallenge(role, i < 10 ? 'HARD' : 'EXPERT', i));
            } else {
                allChallenges.push(generateAlgorithmChallenge(role, i < 10 ? 'HARD' : 'EXPERT', i + 50));
            }
        }

        // Generate 25 "Boss" Challenges (Expert)
        for (let i = 0; i < 25; i++) {
            allChallenges.push({
                title: `${role} Mastery ${i + 1}`,
                description: `Solve the ultimate ${role} paradox. Complex output required.`,
                narrative: `You have reached the apex. Prove your worth as a ${role} master.`,
                difficulty: 'EXPERT',
                category: 'ALGORITHMS',
                language: 'javascript',
                starterCode: `function solve(input) { // Master solution }`,
                solutionCode: `function solve(input) { return true; }`,
                testCases: [{ input: '"test"', expectedOutput: 'true', isHidden: false }],
                xpReward: 1000,
                goldReward: 500,
                requiredLevel: 10,
                order: 900 + i,
                targetClasses: [role]
            });
        }
    }

    return allChallenges;
};

const items = [
    // WEAPONS
    { name: 'Mechanical Keyboard +5', description: 'Legendary clicky switches. Damage +10.', type: 'WEAPON', rarity: 'RARE', price: 1200, effects: [{ type: 'DAMAGE_BOOST', value: 10 }] },
    { name: 'Neural Interface Pro', description: 'Brain-to-code link. Damage +25, Speed +10.', type: 'WEAPON', rarity: 'LEGENDARY', price: 5000, effects: [{ type: 'DAMAGE_BOOST', value: 25 }, { type: 'SPEED_BOOST', value: 10 }] },
    { name: 'Quantum Mouse', description: 'Clicks before you intend to. Speed +15.', type: 'WEAPON', rarity: 'EPIC', price: 3000, effects: [{ type: 'SPEED_BOOST', value: 15 }] },
    { name: 'Ergo Split Key', description: 'Saves your wrists. Damage +5.', type: 'WEAPON', rarity: 'UNCOMMON', price: 800, effects: [{ type: 'DAMAGE_BOOST', value: 5 }] },

    // ARMOR
    { name: 'Liquid Cooling System', description: 'Prevents overheating. Speed +15%.', type: 'ARMOR', rarity: 'UNCOMMON', price: 500, effects: [{ type: 'SPEED_BOOST', value: 15 }] },
    { name: 'Screen Filter', description: 'Blocks blue light. Defense +5 (imaginary).', type: 'ARMOR', rarity: 'COMMON', price: 300, effects: [{ type: 'SPEED_BOOST', value: 5 }] },
    { name: 'Noise Cancelling Headphones', description: 'Block out the world. Focus +20.', type: 'ARMOR', rarity: 'RARE', price: 1500, effects: [{ type: 'XP_BOOST', value: 5 }] },
    { name: 'Posture Chair', description: 'Back support +100.', type: 'ARMOR', rarity: 'EPIC', price: 4000, effects: [{ type: 'SPEED_BOOST', value: 10 }] },

    // ACCESSORIES
    { name: 'Rubber Duck Charm', description: 'Detects hidden bugs.', type: 'ACCESSORY', rarity: 'COMMON', price: 200, effects: [{ type: 'HINT_REVEAL', value: 1 }] },
    { name: 'Golden IDE License', description: 'Premium features. Gold +20%.', type: 'ACCESSORY', rarity: 'EPIC', price: 2500, effects: [{ type: 'GOLD_BOOST', value: 20 }] },
    { name: 'Github Copilot', description: 'AI Assistant. Speed +25%.', type: 'ACCESSORY', rarity: 'LEGENDARY', price: 6000, effects: [{ type: 'SPEED_BOOST', value: 25 }] },
    { name: 'StackOverflow Bookmark', description: 'Instant answers.', type: 'ACCESSORY', rarity: 'UNCOMMON', price: 400, effects: [{ type: 'HINT_REVEAL', value: 2 }] },

    // CONSUMABLES
    { name: 'Energy Drink XL', description: 'XP +25% for 1 challenge.', type: 'CONSUMABLE', rarity: 'COMMON', price: 100, effects: [{ type: 'XP_BOOST', value: 25 }] },
    { name: 'Espresso Shot', description: 'Speed +50% for 1 challenge.', type: 'CONSUMABLE', rarity: 'UNCOMMON', price: 150, effects: [{ type: 'SPEED_BOOST', value: 50 }] },
    { name: 'Pizza Slice', description: 'Restores morale.', type: 'CONSUMABLE', rarity: 'COMMON', price: 50, effects: [{ type: 'XP_BOOST', value: 10 }] },
    { name: 'Nootropic Pill', description: 'Brain booster. XP +50%.', type: 'CONSUMABLE', rarity: 'RARE', price: 300, effects: [{ type: 'XP_BOOST', value: 50 }] },
];

async function seed() {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Challenge.deleteMany({});
        await Item.deleteMany({});
        console.log('Cleared existing data');

        const generatedChallenges = generateAllChallenges();
        console.log(`Generated ${generatedChallenges.length} challenges`);

        // Insert in chunks to avoid timeout/memory issues
        const CHUNK_SIZE = 100;
        for (let i = 0; i < generatedChallenges.length; i += CHUNK_SIZE) {
            const chunk = generatedChallenges.slice(i, i + CHUNK_SIZE);
            await Challenge.insertMany(chunk);
            console.log(`Inserted chunk ${i / CHUNK_SIZE + 1}`);
        }

        await Item.insertMany(items);
        console.log(`Inserted ${items.length} items`);

        console.log('✅ Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
