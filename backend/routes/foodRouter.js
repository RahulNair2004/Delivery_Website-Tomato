import express from 'express';
import { addFood, listFood ,removeFood} from '../controllers/foodController.js'; // Correctly importing both functions
import multer from 'multer';

const foodRouter = express.Router();

// Image upload configuration with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // The folder where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generating a unique filename
    }
});

const upload = multer({ storage: storage });

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);  // Using the listFood function
foodRouter.post("/remove",removeFood);


export default foodRouter;
