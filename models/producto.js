import { Schema, model } from "mongoose"

const ProductoSchema = Schema({
    categoria: {
        type: String,
        required: [true, 'La categoria es obligatoria']
    },
    marca: {
        type: String,
        required: [true, 'La marca es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    nombreProducto: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    imagen: {
        type: String,
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
})

ProductoSchema.methods.toJSON = function () {
    const { __v, ...usuario } = this.toObject();
    return usuario;
}


export default model('Producto', ProductoSchema);