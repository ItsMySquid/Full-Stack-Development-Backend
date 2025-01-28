import express from 'express';
import Block from "../models/Block.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const blocks = [
    {
        name: "Stone",
        description: "A common solid block found in the Overworld.",
        category: "Natural",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Dirt",
        description: "A block commonly found in most biomes.",
        category: "Natural",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Sand",
        description: "A block affected by gravity, commonly found in beaches and deserts.",
        category: "Natural",
        stackSize: 64,
        gravity: true,
    },
    {
        name: "Gravel",
        description: "A gravity-affected block that can drop flint.",
        category: "Natural",
        stackSize: 64,
        gravity: true,
    },
    {
        name: "Oak Planks",
        description: "A versatile building block crafted from oak wood.",
        category: "Wood",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Cobblestone",
        description: "A block obtained by mining stone with a pickaxe.",
        category: "Building",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Brick",
        description: "A decorative building block made from clay bricks.",
        category: "Building",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Glass",
        description: "A transparent block that can be used for windows.",
        category: "Decorative",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Obsidian",
        description: "A tough block formed by water meeting lava.",
        category: "Natural",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Glowstone",
        description: "An illuminating block found in the Nether.",
        category: "Light Source",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Netherrack",
        description: "A common block found in the Nether dimension.",
        category: "Nether",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "End Stone",
        description: "A block found in the End dimension.",
        category: "End",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Iron Block",
        description: "A block of iron used for storage or construction.",
        category: "Metal",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Gold Block",
        description: "A block of gold used for storage or decoration.",
        category: "Metal",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Redstone Block",
        description: "A block that provides a constant redstone signal.",
        category: "Redstone",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "TNT",
        description: "An explosive block that detonates when ignited.",
        category: "Utility",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Leaves",
        description: "A block found on trees, can decay when wood is removed.",
        category: "Natural",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Bedrock",
        description: "An unbreakable block found at the bottom of the world.",
        category: "Unbreakable",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Snow Block",
        description: "A block made of compacted snow layers.",
        category: "Natural",
        stackSize: 64,
        gravity: false,
    },
    {
        name: "Sea Lantern",
        description: "A light-emitting block found in ocean monuments.",
        category: "Light Source",
        stackSize: 64,
        gravity: false,
    },
];
router.options('/', (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Toegestaande Methods zelfde als bij Allow
    res.status(204).send()
})

router.get('/', async(req, res) => {
    try {
        const spots = await Block.find();
        res.status(200).json({
            items: spots,
            _links: {
                self: {
                    href: "http://145.24.223.76:8001/blocks"
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({error: 'Failed to fetch spots'})
    }
})

router.post('/', async (req, res) => {
    try {
        // Eerst controleren op de 'method' en zorgen dat deze correct is
        if (req.body.method === 'SEED') {
            try {
                // Reset alleen uitvoeren als 'reset' true is
                if (req.body.reset === 'true') {
                    await Block.deleteMany({});
                    console.log('Database cleared');
                }

                await Block.insertMany(blocks);
                res.status(201).json({message: `Created ${blocks.length} spots`});
            } catch (e) {
                console.log(e);
                res.status(500).json({error: 'Failed to create'});
            }
        } else if (req.body.method && req.body.method !== 'SEED') {
            // Als de 'method' ongeldig is, stuur een foutmelding
            res.status(400).json({ error: 'Invalid method, please use SEED' });
        } else {
            // Dit is de sectie voor het aanmaken van een nieuw block wanneer geen method wordt meegegeven
            const {name, description, category, stackSize, gravity} = req.body;

            if (!name || !description || !category) {
                // Als een verplicht veld ontbreekt, geef een foutmelding
                res.status(400).json({error: 'Missing required fields'});
                return;  // Stop hier zodat de rest van de code niet verder wordt uitgevoerd
            }

            // Maak het nieuwe block aan
            const newBlock = await Block.create({
                name,
                description,
                category,
                stackSize,
                gravity,
            });

            res.status(201).json(newBlock);
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({error: 'Failed to create'});
    }
});

router.options('/:id', (req, res) => {
    res.header('Allow', 'GET, PUT, OPTIONS, DELETE'); // Toegestane methodes
    res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS, DELETE'); // Toegestane methodes
    res.status(204).send();
})

router.get('/:id', async (req, res) => {
    try {
        const block = await Block.findOne({ _id: req.params.id });

        if (!block) {
            return res.status(404).json({ error: 'No block found with this id' });
        }

        res.json(block);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, stackSize, gravity } = req.body;

        // Controleer of de verplichte velden zijn meegegeven
        if (!name || !description || !category) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        // Zoek en update het item op basis van ID
        const updatedBlock = await Block.findByIdAndUpdate(
            id,
            { name, description, category, stackSize, gravity },
            { new: true, runValidators: true } // Retourneer het geüpdatete document en valideer velden
        );

        // Controleer of het item bestaat
        if (!updatedBlock) {
            return res.status(404).json({ error: 'Block not found' });
        }

        res.status(200).json(updatedBlock);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to update' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Zoek en verwijder het item op basis van ID
        const deletedBlock = await Block.findByIdAndDelete(id);

        // Controleer of het item bestaat
        if (!deletedBlock) {
            return res.status(404).json({ error: 'Block not found' });
        }

        res.status(204).send(); // Geen content bij succesvolle verwijdering
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to delete' });
    }
});

export default router;