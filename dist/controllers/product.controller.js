// Data awal disimpan di array (tanpa database).
// Data kembali ke kondisi awal setiap kali server dimulai ulang.
const products = [
    { id: 1, name: 'Buku', price: 15000 },
    { id: 2, name: 'Pulpen', price: 5000 },
];
// GET /products -> 200 + array seluruh produk
export function getProducts(req, res) {
    res.status(200).json(products);
}
// GET /products/:id -> 200 + satu produk, atau 404 jika tidak ada
export function getProductById(req, res) {
    // req.params.id berupa string, sedangkan id pada array berupa number.
    const id = Number(req.params.id);
    const product = products.find((item) => item.id === id);
    if (!product) {
        res.status(404).json({ message: 'Produk tidak ditemukan' });
        return;
    }
    res.status(200).json(product);
}
// POST /products -> 201 + produk baru
export function createProduct(req, res) {
    // Di Express 5, req.body bernilai undefined jika tidak ada body yang terbaca.
    const { name, price } = req.body ?? {};
    if (typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({ message: 'name wajib berupa teks yang tidak kosong' });
        return;
    }
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
        res.status(400).json({ message: 'price wajib berupa angka dan tidak boleh negatif' });
        return;
    }
    // ID baru = ID terbesar + 1, supaya tidak bertabrakan dengan ID yang sudah ada.
    const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const newProduct = { id: nextId, name: name.trim(), price };
    products.push(newProduct);
    res.status(201).json(newProduct);
}
