// // words.js — drawable words for the guessing game.
// // All concrete, sketchable nouns (abstract words can't be drawn/guessed).
// // Grouped by category in comments for easy editing; it's all one flat array.

// const WORDS = [
//   // --- Land mammals ---
//   "dog", "cat", "horse", "cow", "pig", "sheep", "goat", "lion", "tiger", "elephant",
//   "giraffe", "zebra", "monkey", "gorilla", "bear", "panda", "koala", "kangaroo", "rabbit", "mouse",
//   "rat", "squirrel", "fox", "wolf", "deer", "moose", "camel", "donkey", "hippo", "rhino",
//   "cheetah", "leopard", "hyena", "raccoon", "skunk", "beaver", "otter", "hedgehog", "bat", "mole",
//   "badger", "buffalo", "bison", "llama", "alpaca", "hamster", "ferret", "chipmunk", "porcupine", "armadillo",
//   "sloth", "anteater", "platypus", "meerkat", "lemur", "baboon", "chimpanzee", "orangutan", "walrus", "elk",
//   "antelope", "gazelle", "panther", "jaguar", "lynx", "bobcat", "cougar", "weasel", "opossum", "wombat",
//   "puppy", "kitten", "piglet", "lamb", "foal", "calf", "cub", "bull", "ox", "yak",

//   // --- Birds ---
//   "bird", "eagle", "hawk", "owl", "parrot", "penguin", "ostrich", "flamingo", "peacock", "swan",
//   "duck", "goose", "chicken", "rooster", "turkey", "pigeon", "dove", "crow", "raven", "robin",
//   "sparrow", "woodpecker", "hummingbird", "pelican", "seagull", "stork", "crane", "vulture", "falcon", "toucan",
//   "kiwi", "canary", "finch", "chick", "duckling", "blue jay", "cardinal",

//   // --- Sea creatures ---
//   "fish", "shark", "whale", "dolphin", "octopus", "squid", "jellyfish", "starfish", "crab", "lobster",
//   "shrimp", "clam", "oyster", "seahorse", "stingray", "eel", "turtle", "tortoise", "swordfish", "pufferfish",
//   "anglerfish", "manta ray", "narwhal", "orca", "goldfish", "catfish", "sea urchin",

//   // --- Reptiles & amphibians ---
//   "snake", "lizard", "crocodile", "alligator", "chameleon", "iguana", "gecko", "dinosaur", "frog", "toad",
//   "salamander", "newt", "tadpole", "cobra", "python", "rattlesnake", "komodo dragon",

//   // --- Insects & bugs ---
//   "spider", "ant", "bee", "wasp", "butterfly", "moth", "ladybug", "beetle", "grasshopper", "cricket",
//   "dragonfly", "mosquito", "fly", "cockroach", "caterpillar", "worm", "centipede", "scorpion", "tick", "flea",
//   "firefly", "praying mantis", "snail", "slug", "termite", "maggot",

//   // --- Mythical creatures ---
//   "unicorn", "dragon", "phoenix", "griffin", "mermaid", "centaur", "cyclops", "minotaur", "fairy", "elf",
//   "dwarf", "troll", "ogre", "giant", "genie", "yeti", "bigfoot", "gargoyle", "pegasus", "kraken",
//   "werewolf", "vampire", "zombie", "ghost", "witch", "wizard", "goblin", "demon", "angel", "devil",

//   // --- Fruits ---
//   "apple", "banana", "orange", "grape", "strawberry", "watermelon", "pineapple", "mango", "peach", "pear",
//   "cherry", "lemon", "lime", "coconut", "pomegranate", "raspberry", "blueberry", "blackberry", "plum", "apricot",
//   "fig", "papaya", "melon", "cantaloupe", "grapefruit", "avocado", "kiwi fruit", "dragon fruit", "passion fruit",

//   // --- Vegetables ---
//   "carrot", "potato", "onion", "garlic", "broccoli", "cauliflower", "cabbage", "lettuce", "spinach", "cucumber",
//   "pepper", "corn", "peas", "beans", "mushroom", "eggplant", "pumpkin", "radish", "beet", "celery",
//   "asparagus", "zucchini", "squash", "turnip", "leek", "artichoke", "ginger", "chili", "tomato", "okra",

//   // --- Prepared food & dishes ---
//   "pizza", "burger", "hotdog", "sandwich", "taco", "burrito", "sushi", "pasta", "spaghetti", "noodles",
//   "soup", "salad", "fries", "popcorn", "pancake", "waffle", "donut", "cake", "cupcake", "cookie",
//   "pie", "bread", "toast", "bagel", "croissant", "muffin", "pretzel", "candy", "chocolate", "ice cream",
//   "lollipop", "cheese", "egg", "bacon", "sausage", "steak", "meatball", "dumpling", "nachos", "omelette",
//   "cereal", "honey", "jam", "butter", "ketchup", "mustard", "pickle", "ramen", "kebab", "gingerbread man",
//   "candy cane", "marshmallow", "popsicle", "fortune cookie", "fried egg", "french toast", "pudding", "jelly",

//   // --- Drinks ---
//   "coffee", "tea", "milk", "juice", "soda", "lemonade", "smoothie", "milkshake", "wine", "cocktail",
//   "hot chocolate", "water bottle", "soda can",

//   // --- Kitchen items ---
//   "plate", "bowl", "cup", "mug", "glass", "fork", "knife", "spoon", "chopsticks", "pot",
//   "pan", "kettle", "teapot", "blender", "toaster", "microwave", "oven", "stove", "refrigerator", "sink",
//   "cutting board", "rolling pin", "whisk", "spatula", "ladle", "strainer", "grater", "can opener", "corkscrew", "napkin",
//   "straw", "jar", "bottle", "thermos", "lunchbox", "pitcher", "frying pan", "wine glass",

//   // --- Furniture & home ---
//   "chair", "table", "sofa", "couch", "bed", "desk", "bookshelf", "dresser", "wardrobe", "cabinet",
//   "drawer", "mirror", "lamp", "clock", "rug", "curtain", "blinds", "pillow", "blanket", "mattress",
//   "stool", "bench", "shelf", "nightstand", "ottoman", "recliner", "fireplace", "chandelier", "rocking chair", "bunk bed",

//   // --- Bathroom ---
//   "toilet", "bathtub", "shower", "towel", "soap", "shampoo", "toothbrush", "toothpaste", "razor", "comb",
//   "brush", "hairdryer", "toilet paper", "sponge", "bucket", "mop", "broom", "plunger", "bathroom scale",

//   // --- Electronics & tech ---
//   "computer", "laptop", "keyboard", "monitor", "phone", "smartphone", "tablet", "television", "radio", "camera",
//   "headphones", "speaker", "microphone", "printer", "scanner", "router", "charger", "battery", "remote", "calculator",
//   "webcam", "joystick", "controller", "drone", "robot", "satellite", "antenna", "light bulb", "flashlight", "lightswitch",

//   // --- Clothing & accessories ---
//   "shirt", "t-shirt", "pants", "jeans", "shorts", "skirt", "dress", "jacket", "coat", "sweater",
//   "hoodie", "vest", "suit", "tie", "bowtie", "scarf", "gloves", "mittens", "hat", "cap",
//   "helmet", "socks", "shoes", "boots", "sandals", "sneakers", "slippers", "high heels", "belt", "glasses",
//   "sunglasses", "watch", "ring", "necklace", "bracelet", "earring", "button", "zipper", "backpack", "purse",
//   "wallet", "umbrella", "raincoat", "swimsuit", "pajamas", "apron", "uniform", "crown", "mask", "mitten",

//   // --- Body parts ---
//   "head", "face", "eye", "ear", "nose", "mouth", "lips", "teeth", "tongue", "chin",
//   "cheek", "eyebrow", "eyelash", "hair", "neck", "shoulder", "arm", "elbow", "wrist", "hand",
//   "finger", "thumb", "nail", "chest", "stomach", "back", "hip", "leg", "knee", "ankle",
//   "foot", "toe", "heart", "brain", "lung", "bone", "skeleton", "skull", "rib", "footprint",
//   "fingerprint", "mustache", "beard", "eyeball", "kidney", "tooth",

//   // --- Transportation & vehicles ---
//   "car", "truck", "bus", "van", "taxi", "motorcycle", "bicycle", "scooter", "train", "tram",
//   "subway", "airplane", "jet", "helicopter", "rocket", "boat", "ship", "yacht", "canoe", "kayak",
//   "sailboat", "submarine", "ferry", "raft", "tractor", "bulldozer", "ambulance", "fire truck", "police car", "jeep",
//   "limousine", "wagon", "sled", "skateboard", "rollerblades", "hot air balloon", "blimp", "spaceship", "ufo", "anchor",
//   "wheel", "tire", "engine", "propeller", "sail", "steering wheel", "parachute", "wheelchair", "shopping cart", "stroller",

//   // --- Buildings & places ---
//   "house", "apartment", "castle", "palace", "tower", "skyscraper", "hut", "cabin", "tent", "igloo",
//   "barn", "church", "temple", "mosque", "cathedral", "pyramid", "lighthouse", "windmill", "bridge", "tunnel",
//   "fence", "gate", "door", "window", "roof", "chimney", "stairs", "elevator", "escalator", "school",
//   "hospital", "library", "museum", "bank", "hotel", "restaurant", "cafe", "store", "mall", "factory",
//   "office", "garage", "prison", "stadium", "theater", "cinema", "zoo", "aquarium", "park", "playground",
//   "garden", "farm", "fountain", "statue", "monument", "treehouse", "birdhouse", "doghouse", "outhouse", "greenhouse",

//   // --- Nature & plants ---
//   "tree", "flower", "grass", "bush", "leaf", "branch", "root", "seed", "plant", "cactus",
//   "palm tree", "pine tree", "vine", "fern", "moss", "sunflower", "rose", "tulip", "daisy", "lily",
//   "dandelion", "clover", "acorn", "pinecone", "log", "stump", "petal", "bamboo", "ivy", "lotus",

//   // --- Landscape ---
//   "mountain", "hill", "volcano", "cliff", "valley", "cave", "desert", "beach", "island", "ocean",
//   "sea", "lake", "river", "stream", "waterfall", "pond", "swamp", "forest", "jungle", "meadow",
//   "field", "canyon", "glacier", "iceberg", "rock", "stone", "boulder", "pebble", "sand", "mud",
//   "cloud", "rainbow", "lightning", "tornado", "hurricane", "snowflake", "icicle", "puddle", "dune", "coral reef",

//   // --- Sky & space ---
//   "sun", "moon", "star", "planet", "earth", "saturn", "comet", "meteor", "galaxy", "constellation",
//   "eclipse", "asteroid", "shooting star", "crescent moon", "solar system",

//   // --- Weather ---
//   "rain", "snow", "wind", "fog", "sunshine", "storm", "thunder", "hail", "raindrop", "snowman",

//   // --- Sports & games ---
//   "football", "soccer ball", "basketball", "baseball", "tennis ball", "golf ball", "volleyball", "bowling ball", "ping pong", "badminton",
//   "hockey stick", "cricket bat", "frisbee", "dartboard", "racket", "baseball glove", "goal", "hoop", "surfboard", "snowboard",
//   "ski", "ice skate", "trophy", "medal", "whistle", "dumbbell", "treadmill", "jump rope", "boxing glove", "kite",
//   "yo-yo", "marbles", "dice", "chess", "checkers", "dominoes", "puzzle", "playing cards", "soccer goal", "bowling pin",
//   "ferris wheel", "roller coaster", "carousel", "trampoline", "seesaw", "swing", "slide", "sandbox", "sandcastle", "fishing rod",

//   // --- Musical instruments ---
//   "guitar", "piano", "violin", "cello", "drum", "trumpet", "trombone", "saxophone", "flute", "clarinet",
//   "harp", "accordion", "harmonica", "tuba", "banjo", "ukulele", "xylophone", "tambourine", "maracas", "bongo",
//   "bagpipes", "triangle", "cymbals", "electric guitar", "grand piano",

//   // --- Tools & hardware ---
//   "hammer", "screwdriver", "wrench", "drill", "saw", "axe", "screw", "bolt", "pliers",
//   "tape measure", "chisel", "ladder", "toolbox", "wheelbarrow", "shovel", "rake", "hoe", "pitchfork", "scythe",
//   "scissors", "clamp", "anvil", "magnet", "rope", "chain", "hook", "gear", "spring", "paintbrush",
//   "paint roller", "glue", "tape", "stapler", "vise", "level", "sandpaper", "file", "crowbar", "nut and bolt",

//   // --- Office & school supplies ---
//   "pencil", "pen", "marker", "crayon", "eraser", "ruler", "notebook", "paper", "book", "folder",
//   "binder", "paperclip", "globe", "map", "chalkboard", "whiteboard", "pencil case", "highlighter", "sharpener", "compass",
//   "protractor", "calendar", "envelope", "stamp", "postcard", "letter", "newspaper", "magazine", "dictionary", "diploma",
//   "easel", "clipboard", "thumbtack", "rubber band", "ink", "quill", "scroll", "bookmark", "sticky note", "abacus",

//   // --- Toys & fun ---
//   "doll", "teddy bear", "balloon", "bubble", "spinning top", "building blocks", "action figure", "toy car", "train set", "slinky",
//   "jack-in-the-box", "rocking horse", "water gun", "bow and arrow", "slingshot", "kaleidoscope", "puppet", "snow globe", "pinwheel", "rubber duck",

//   // --- Weapons (cartoon / historical) ---
//   "sword", "shield", "bow", "arrow", "spear", "dagger", "cannon", "catapult", "armor", "knight helmet",

//   // --- People & jobs ---
//   "doctor", "nurse", "teacher", "chef", "police officer", "firefighter", "soldier", "pilot", "sailor", "farmer",
//   "fisherman", "painter", "artist", "dancer", "singer", "actor", "clown", "magician", "astronaut", "scientist",
//   "judge", "king", "queen", "prince", "princess", "knight", "pirate", "cowboy", "ninja", "superhero",
//   "santa", "mailman", "plumber", "carpenter", "mechanic", "barber", "dentist", "waiter", "lifeguard",
//   "detective", "spy", "referee", "alien", "caveman", "viking", "gladiator", "scarecrow", // --- Holidays & celebration ---
//   "christmas tree", "present", "gift box", "candle", "fireworks", "jack-o-lantern", "easter egg", "ornament", "wreath", "stocking",
//   "mistletoe", "party hat", "confetti", "ribbon", "valentine", "cupid", "menorah", "lantern", "birthday cake", "pinata",

//   // --- Containers & misc objects ---
//   "key", "lock", "padlock", "hourglass", "telescope", "binoculars", "magnifying glass", "microscope", "thermometer", "scale",
//   "torch", "plug", "wire", "basket", "box", "crate", "barrel", "bag", "suitcase", "briefcase",
//   "fan", "dustpan", "trash can", "mailbox", "beehive", "spider web", "nest", "cage", "fishbowl", "leash",
//   "collar", "saddle", "horseshoe", "trap", "flag", "banner", "sign", "traffic light", "stop sign", "fire hydrant",
//   "street lamp", "lamp post", "vending machine", "gumball machine", "treasure chest", "piggy bank", "coin", "diamond", "crown jewels", "pearl",

//   // --- Health & medical ---
//   "band-aid", "bandage", "crutch", "stethoscope", "syringe", "pill", "first aid kit", "cast", "eyepatch", "x-ray",

//   // --- Shapes ---
//   "circle", "square", "rectangle", "diamond shape", "oval", "cross", "spiral", "hexagon",
//   "pentagon", "cube", "sphere", "cone", "cylinder", "lightning bolt", "puzzle piece", "infinity sign", "yin yang",

//   // --- Scenes & weather objects ---
//   "campfire", "bonfire", "picnic", "treasure map", "snow fort", "tepee", "windsock", "weathervane", "sundial" ];

// function pickWord() {
//   return WORDS[Math.floor(Math.random() * WORDS.length)];
// }

// module.exports = { WORDS, pickWord };