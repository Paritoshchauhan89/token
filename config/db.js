import mongoose from 'mongoose'


const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database connected Successfully ${conn.connection.host}`.bgMagenta.white);
        
    } catch (error) {
        console.log(`Error in Mongodb ${error}`.bgRed.white)
        
    }
};


export default connectDB;