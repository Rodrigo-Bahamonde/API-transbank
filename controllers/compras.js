import { response, request } from 'express'
import fetch from "node-fetch";
import mercadopago from "mercadopago"
import Pedido from '../models/pedido.js';
import Producto from '../models/producto.js';

// const URL = 'https://webpay3gint.transbank.cl/'
// const ApiKeyId = '597055555532'
// const ApiKeySecret = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
// const endpointCrear = '/rswebpaytransaction/api/webpay/v1.2/transactions'
const URL = 'https://api.mercadopago.com';
const TOKEN = 'TEST-6811250837721448-061817-97fbeae1cb690b8e8b201558f41fd16a-1402523360'
const notificationURL = 'https://3b50-2800-300-6713-1180-00-1.sa.ngrok.io'
const backURL = 'http://127.0.0.1:8000'


const validarCantidadProducto = async (productos) => {
    let result = true;

    for (const element of productos) {
        const producto = await Producto.findById(element.id);
        if (producto.stock < element.cantidad) {
            result = false;
        }
    };
    return result;
}

const descontarProductos = async (idProducto, cantidadDescontar) => {
    //Obtener producto de base de datos
    try {
        const producto = await Producto.findById(idProducto);
        const cantidad = producto.stock - cantidadDescontar;
        const productoFinal = await Producto.findByIdAndUpdate(idProducto, { stock: cantidad }, { new: true });
    } catch (err) {
        console.log(err)
    }
}

const comprasPost = async (req = request, res = response) => {

    const data = req.body;
    const validarStock = await validarCantidadProducto(data.productos);
    if (validarStock === false) {
        res.status(400)
        res.json({
            mensaje: 'No hay stock disponible'
        })
        return;
    } 

    let items = [];
    let itemsPedido = [];
    let total = 0;

    data.productos.forEach(async element => {

        const itemMercadoPago = {
            id: element.id,
            title: element.nombreProducto,
            unit_price: parseInt(element.precio),
            currency_id: "CLP",
            quantity: parseInt(element.cantidad),
        }
        const itemPedido = {
            productoId: element.id,
            cantidad: parseInt(element.cantidad)
        }
        itemsPedido.push(itemPedido);
        items.push(itemMercadoPago);
        total += parseInt(element.precio)

        await descontarProductos(element.id, element.cantidad);
    });

    mercadopago.configure({
        access_token: TOKEN,
    })

    const result = await mercadopago.preferences.create({
        items,
        payer: {
            name: data.nombre,
            surname: data.apellido,
            email: data.correo,
            phone: {
                area_code: "56",
                number: parseInt(data.telefono)
            },
            identification: {
                type: "DNI",
                number: data.rut
            },
        },
        back_urls: {
            success: backURL + '/boleta',
            failure: backURL + '/error-compra',
            pending: backURL + '/compra-pendiente'
        },
        notification_url: 'https://8cba-2800-300-6714-d030-00-2.sa.ngrok.io/api/compras/webhook'
    })

    const url = result.body.init_point

    //Crear un pedido
    const pedido = new Pedido({
        pedidoId: result.body.id,
        clienteRut: data.rut,
        clienteNombre: data.nombre,
        clienteApellido: data.apellido,
        clienteCorreo: data.correo,
        total,
        fecha: data.fecha,
        estado: 'pendiente',
        direccion: data.direccion,
        productos: itemsPedido
    })

    await pedido.save();

    res.json({
        url
    })
};

//Webhook
const webhookPost = async (req = request, res = response) => {
    const payment = req.query;
    const body = req.body;
    console.log('payment');
    console.log(payment);
    console.log('body');
    console.log(body);
    // let info = {
    //     ordenCompra: '',
    //     ultimosCuatroDigitosTarjeta: '',
    //     fechaTransaccion: '',
    //     estado: '',
    //     moneda: '',
    //     descripcion: '',
    //     metodoPago: '',
    //     tipoPago: '',
    //     monto: '',
    //     email: '',
    //     rut: '',
    //     nombre: '',
    //     apellido: '',
    //     direccion: '',
    // };
    try {
        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment["data.id"]);
            console.log('data.body');
            console.log(data.body);
            console.log(data.body.status); //estadi approved
            console.log('data.body.additional_info');
            console.log(data.body.additional_info);
            console.log('data.body.additional_info.items');
            console.log(data.body.additional_info.items); //muestra los items
            // info.ultimosCuatroDigitosTarjeta = data.body.card.last_four_digits;
        }
        // res.sendStatus(204);
    } catch (err) {
        console.log(err);
        // res.sendStatus(500).json({ error: error.message });
    }

}

// const comprasPost = async (req = request, res = response) => {

//     const data = req.body
// console.log(data);
//     const body = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Tbk-Api-Key-Id': ApiKeyId,
//             'Tbk-Api-Key-Secret': ApiKeySecret
//         },
//         body: JSON.stringify(data)
//     }


//     const message = await fetch(URL + endpointCrear, body)
//         .then(response => response.text())
//         .then(result => JSON.parse(result))
//         .catch(error => console.log('error', error));

//     res.json({
//         message
//     })
// };


export {
    comprasPost,
    webhookPost,
}