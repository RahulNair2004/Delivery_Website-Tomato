import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rahulnair0306:rahulnair2004@cluster0.9kkti.mongodb.net/food-Delivery?retryWrites=true&w=majority').then(() => console.log("DB Connected"));

}