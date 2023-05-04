//file server chi co mot nhiem vu la khai bao port va khoi dong server cua chung ta
const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`);
});


process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
})