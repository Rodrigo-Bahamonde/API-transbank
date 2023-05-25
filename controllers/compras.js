import { response, request } from 'express'
import fetch from "node-fetch";

const URL = 'https://webpay3gint.transbank.cl/'
const ApiKeyId = '597055555532'
const ApiKeySecret = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
const endpointCrear = '/rswebpaytransaction/api/webpay/v1.2/transactions'

const comprasPost = async (req = request, res = response) => {

    const data = req.body
console.log(data);
    const body = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Tbk-Api-Key-Id': ApiKeyId,
            'Tbk-Api-Key-Secret': ApiKeySecret
        },
        body: JSON.stringify(data)
    }


    const message = await fetch(URL + endpointCrear, body)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => console.log('error', error));

    res.json({
        message
    })
};


export {
    comprasPost,
}