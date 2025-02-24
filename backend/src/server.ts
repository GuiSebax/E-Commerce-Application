import { app } from './index';
import productRoutes from './routes/ProductRoutes';
import orderRoutes from './routes/OrderRoutes';
import addressRoutes from './routes/AddressRoutes'
import categoryRoutes from './routes/CategoryRoutes';
import userRoutes from './routes/UserRoutes';
import authRoutes from './routes/AuthRoutes';


const PORT = process.env.PORT || 3000;

// Endpoints
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});