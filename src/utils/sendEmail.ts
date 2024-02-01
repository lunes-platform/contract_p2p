import axios from "axios";
//save mail "https://developers.brevo.com/docs/synchronise-contact-lists"
const send_email = (email: string, subject: string, msg: string) => {
    try{
        const form = new FormData();
        let from_: string = process.env.REACT_APP_CONTRACT_ADDRESS || ""
        let key_: string = process.env.REACT_APP_EMAIL_KEY || ""
        let cc_: string = process.env.REACT_APP_EMAIL_CC || ""
        form.append('email_to', email);
        form.append('key', key_);
        form.append('cc_email', cc_);
        form.append('from', from_);
        form.append('subject', subject);
        form.append('message', msg);
    
        axios.post('/email.php', form,{
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*'
              }
        })
    }catch(e){
        console.log(e)
    }
   
}
const message_buy = (value: string,price:string, pair: string) => {
    return (
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation of OTC Cryptocurrency Transaction</title>
        </head>
        <body>

            <p>Subject: Confirmation of OTC Cryptocurrency Transaction</p>

            <p>Hello LUNES</p>

            <p>I hope this message finds you well. We would like to inform you that a successful OTC transaction has been conducted in your cryptocurrency account with OTC LUNES. We appreciate your trust in our platform.</p>

            <p>Transaction Details:
                <ul>
                    <li>Type: Cryptocurrency Sale</li>
                    <li>Quantity:${value} LUNES</li>
                    <li>Currency: ${pair}</li>                    
                    <li>Total Value: ${price} ${pair}</li>
                </ul>
            </p>

            <p>This transaction will be reflected in your statement and may take some time to be fully processed. Please make sure to check your account to confirm the details.</p>

            <p>If you have any questions or need further assistance, our support team is available to help. Contact us at support@lunes.io or reply to this email.</p>

            <p>Thank you again for choosing our services. We are committed to providing you with a secure and efficient experience in your OTC cryptocurrency transactions.</p>

            <p>Best regards,</p>
            <p>OTC LUNES<br>Support<br></p>

        </body>
        </html>
        `
    )
}
const message_receipt = (id:string, receipt:string, pair:string) => {
return(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt Notification</title>
    </head>
    <body>
    
        <p>Subject: Receipt Notification</p>
    
        <p>Hello LUNES,</p>
    
        <p>Receipt Details:
            <ul>
                <li>Deposit Type: ${pair}</li>
                <li>Reference Number:OTC - ${id}</li>
                <li>TXID: ${receipt.split(":")[1]}</li>
            </ul>
        </p>
    
        <p>This deposit will be reflected in your account statement. Please review your account to verify the details.</p>
    
        <p>If you have any questions or concerns regarding this deposit, please feel free to contact our support team at support@lunes.io .</p>
    
        <p>Thank you for your continued trust inL UNES. We appreciate your business.</p>
    
        <p>Best regards,</p>
        <p>OTC LUNES<br>Support<br></p>
    
    </body>
    </html
    `
)
}

const mensagem_deposit = (value:string,txid: string, id: string) => {
    return(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Deposit Notification</title>
        </head>
        <body>
        
            <p>Subject: Deposit Notification</p>
        
            <p>Hello LUNES,</p>
        
            <p>We are pleased to inform you that a deposit has been successfully credited to your account with LUNES OTC. Thank you for choosing our services.</p>
        
            <p>Deposit Details:
                <ul>
                    <li>Deposit Type: LUNES</li>
                    <li>Amount: ${value}</li>
                    <li>Reference Number:OTC - ${id}</li>
                    <li>TXID: ${txid}</li>
                </ul>
            </p>
        
            <p>This deposit will be reflected in your account statement. Please review your account to verify the details.</p>
        
            <p>If you have any questions or concerns regarding this deposit, please feel free to contact our support team at support@lunes.io.</p>
        
            <p>Thank you for your continued trust inL UNES. We appreciate your business.</p>
        
            <p>Best regards,</p>
            <p>OTC LUNES<br>Support<br></p>
        
        </body>
        </html
        `
    )
}
const open_conflit_p2p = (id:string, date_expire:string, value: string) =>{
    return(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Conflit Notification</title>
        </head>
        <body>
        
            <p>Subject: Conflit Notification</p>
        
            <p>Hello LUNES,</p>
        
            <p>Open Conlit id ${id}.</p>
        
            <p>Deposit Details:
                <ul>
                    <li>Deposit Type: LUNES</li>
                    <li>Amount: ${value}</li>
                    <li>Reference Number:OTC - ${id}</li>
                    <li>Date Expire: ${new Date(date_expire)}</li>
                </ul>
            </p>
        
            <p>This deposit will be reflected in your account statement. Please review your account to verify the details.</p>
        
            <p>If you have any questions or concerns regarding this deposit, please feel free to contact our support team at support@lunes.io.</p>
        
            <p>Thank you for your continued trust inL UNES. We appreciate your business.</p>
        
            <p>Best regards,</p>
            <p>OTC LUNES<br>Support<br></p>
        
        </body>
        </html
        `
    )
}
export {mensagem_deposit, message_buy, send_email, message_receipt, open_conflit_p2p}