import mongoose from "mongoose";

const dbConnection = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_CNN);
        
        console.log('Base de datos online');

    } catch (err) {
        console.log(err);
        throw new Error('Error al conectar a la base de datos')
    }
}


export default dbConnection