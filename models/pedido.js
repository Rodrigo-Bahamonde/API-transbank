import { Schema, model } from "mongoose"

const PedidoSchema = Schema({
    pedidoId: {
        type: String,
        required: [true, 'El id del pedido es obligatorio']
    },
    clienteRut: {
        type: String,
        required: [true, 'El rut del cliente es obligatorio']
    },
    clienteNombre: {
        type: String,
        required: [true, 'El nombre del cliente es obligatorio']
    },
    clienteApellido: {
        type: String,
        required: [true, 'El apellido del cliente es obligatorio']
    },
    clienteCorreo: {
        type: String,
        required: [true, 'El correo del cliente es obligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total del pedido es obligatorio']
    },
    fecha: {
        type: String,
        required: [true, 'La fecha de pedido es obligatoria']
    },
    estado: {
        type: String,
        required: [true]
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    productos: [
        {
            productoId: {
                type: String,
                required: [true, 'El id del producto es obligatorio']
            },
            cantidad: {
                type: Number,
                required: [true, 'La cantidad de productos es obligatoria']
            }
        }
    ],
})

// ProductoSchema.methods.toJSON = function () {
//     const { __v, ...usuario } = this.toObject();
//     return usuario;
// }

export default model('Pedido', PedidoSchema);