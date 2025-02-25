import foodModel from "../models/foodModel.js";
import fs from "fs"; // Import the fs module to delete files
import path from "path"; // Import the path module to get the file path
import multer from "multer";

// Add food item
const addFood = async (req, res) => {
    console.log(req.file); // Debugging line to check if file is uploaded

    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }

    let image_filename = req.file.filename; // This should work if multer is handling the file correctly

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image: image_filename, // Save the filename of the uploaded image
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food item added successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Failed to add food item" });
    }
};
// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find(); // Fetch all food items from the database
        res.json({ success: true, foods }); // Send the list of foods back to the client
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Failed to retrieve food items" });
    }
};

// remove food item
const removeFood = async (req, res) => {
    try {
        // Find the food item by ID
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Remove the image file
        const filePath = `uploads/${food.image}`; // Use backticks correctly
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
            } else {
                console.log(`Deleted file: ${filePath}`);
            }
        });

        // Remove the food item from the database
        await foodModel.findByIdAndDelete(req.body.id);

        // Send success response
        res.json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
        console.error("Error removing food item:", error);
        res.json({ success: false, message: "Failed to remove food item" });
    }
};


export { addFood, listFood,removeFood }; // Ensure both functions are exported