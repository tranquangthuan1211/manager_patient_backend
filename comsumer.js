require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EXCHANGE = 'emailExchange';
const QUEUE = 'emailQueue';
const ROUTING_KEY = 'email.send';

async function connectRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

    console.log('Waiting for messages...');

    channel.consume(
        QUEUE,
        async (msg) => {
            if (msg !== null) {
                const email = JSON.parse(msg.content.toString());
                console.log('Processing email:', email);

                // Gửi email
                try {
                    await sendEmail(email);
                    console.log('Email sent successfully:', email.to);
                    channel.ack(msg); // Xác nhận xử lý xong
                } catch (error) {
                    console.error('Failed to send email:', error);
                    channel.nack(msg, false, true); // Xử lý lại nếu thất bại
                }
            }
        },
        { noAck: false }
    );
}

async function sendEmail({ to, subject, body }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // false nếu sử dụng TLS, true nếu sử dụng SSL
        auth: {
            user: process.env.SMTP_USER, // Email của bạn
            pass: process.env.SMTP_PASS, // Mật khẩu ứng dụng
        },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thông tin đặt lịch làm việc</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            .email-header {
                text-align: center;
                margin-bottom: 20px;
            }
            .email-header h1 {
                font-size: 20px;
                color: #0073e6;
            }
            .email-content {
                line-height: 1.8;
                font-size: 16px;
            }
            .email-footer {
                margin-top: 20px;
                font-size: 14px;
                color: #555;
                text-align: center;
            }
            .highlight {
                color: #0073e6;
                font-weight: bold;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background: #0073e6;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }
            .button:hover {
                background: #005bb5;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>THÔNG TIN ĐẶT LỊCH LÀM VIỆC CỦA BẠN</h1>
            </div>
            <div class="email-content">
                <p>ĐÃ ĐƯỢC GỬI ĐẾN <span class="highlight">PHÒNG KHÁM</span></p>
                <ul>
                    <li>
                        Bạn vui lòng đến đúng địa điểm và thời gian trong Email xác nhận của cơ quan BHXH để được phục vụ tốt nhất.
                    </li>
                    <li>
                        Trong trường hợp cần hỗ trợ, vui lòng liên hệ 
                        <span class="highlight">Tổng đài Chăm sóc khách hàng của MEDIAL Việt Nam 19009068</span>.
                    </li>
                </ul>
                <p>Xin trân trọng cảm ơn!</p>
            </div>
            <div class="email-footer">
                <p>© 2025 Bảo hiểm xã hội Việt Nam. Mọi quyền được bảo lưu.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: process.env.SMTP_USER, // Email người gửi
        to, // Email người nhận
        subject: "Thông tin đặt lịch", // Tiêu đề email
        html: htmlContent, // Nội dung email ở dạng HTML
    });
}


// Kết nối RabbitMQ
connectRabbitMQ().catch(console.error);
