import { useContext, useEffect, useRef, useState } from "react"
import { CartContext } from "../../Context/CartContext"
import './Cart.css'
import toast from "react-hot-toast"
import Loader from "../../Components/Loader/Loader"
import { Link } from "react-router-dom"
// import OrderModal from "../../components/Modal/OrderModal"
import axios from "axios"

export default function Cart() {
    const [cartData, setCartData] = useState(null)
    const { getCart, removeFromCart, setNumOfCartItems, updateQuantity, clearCart } = useContext(CartContext)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenOrder, setIsOpenOrder] = useState(false)

    async function getCartHandler() {
        setIsLoading(true)
        try {
            const res = await getCart()
            setCartData(res.data)
        } catch (error) {
            console.error("Error fetching cart:", error)
            toast.error('Failed to load cart')
        }
        setIsLoading(false)
    }

    async function removeFromCartHandler(productId) {
        setIsLoading(true)
        try {
            const res = await removeFromCart(productId)
            setNumOfCartItems(res.data.totalQuantity)
            setCartData(res.data)
            toast.success('Product removed from cart successfully', {
                duration: 3500,
                style: { padding: '20px' }
            })
        } catch (error) {
            console.error("Error removing from cart:", error)
            toast.error('Something went wrong')
        }
        setIsLoading(false)
    }

    async function updateQuantityHandler(productId, count) {
        if (count < 1) return 
        
        setIsLoading(true)
        try {
            const res = await updateQuantity(productId, count)
            setCartData(res.data)
            toast.success('Quantity updated successfully', {
                duration: 3500,
                style: { padding: '20px' }
            })
        } catch (error) {
            console.error("Error updating quantity:", error)
            toast.error('Something went wrong')
        }
        setIsLoading(false)
    }

    async function clearCartHandler() {
        setIsLoading(true)
        try {
            await clearCart()
            setCartData(null)
            toast.success('Cart cleared successfully', {
                duration: 3500,
                style: { padding: '20px' }
            })
        } catch (error) {
            console.error("Error clearing cart:", error)
            toast.error('Something went wrong')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        getCartHandler()
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            {isLoading && <Loader />}
            <div className="bg-white h-full">
                <div className="container p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Your shopping bag</h2>
                        {cartData?.products?.length > 0 && (
                            <button 
                                onClick={clearCartHandler} 
                                className="mt-4 text-sm px-4 py-2.5 rounded-md bg-red-600 transition-all duration-300 hover:bg-red-700 tracking-wide text-white"
                            >
                                Clear Cart
                            </button>
                        )}
                    </div>
                    <div className="grid lg:grid-cols-3 gap-6 relative mt-6">
                        <div className="lg:col-span-2 space-y-6">
                            {(cartData?.products?.length === 0 || !cartData) && (
                                <div className="bg-white p-4 shadow-[0_2px_9px_-3px_rgba(61,63,68,0.3)] relative">
                                    <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
                                    <p className="text-gray-500 mt-4">You have no items in your shopping cart. Start adding items to your cart.</p>
                                    <Link 
                                        to="/products" 
                                        className="mt-4 inline-block text-sm px-4 py-2.5 rounded-md bg-green-600 transition-all duration-300 hover:bg-green-700 tracking-wide text-white"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            )}

                            {cartData?.products?.map((item) => {
                                return (
                                    <div key={item.product._id} className="p-2 bg-white shadow-[0_2px_9px_-3px_rgba(61,63,68,0.3)] relative">
                                        <div className="grid sm:grid-cols-2 items-center gap-4">
                                            <div className="bg-gradient-to-tr from-gray-300 via-gray-100 flex items-center rounded-2xl justify-center to-gray-50 w-full h-full p-4 shrink-0 text-center">
                                                <Link to={`/product/${item.product._id}`}>
                                                    <img 
                                                        src={item.product.images?.[0] || '/placeholder-image.jpg'} 
                                                        className="w-56 h-full object-contain inline-block rounded-2xl hover:scale-110 transition-all duration-300" 
                                                        alt={item.product.name} 
                                                    />
                                                </Link>
                                            </div>
                                            <div className="p-2">
                                                <Link to={`/product/${item.product._id}`}>
                                                    <h3 className="text-lg font-bold text-gray-800 hover:text-green-600 transition-all duration-200">
                                                        {item.product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-600 mt-2">{item.product.description?.substring(0, 100)}...</p>
                                                <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-sm text-gray-500">Qty:</h4>
                                                        <div className="flex gap-2 items-center border border-gray-300 bg-white px-3 py-2 w-max">
                                                            <button 
                                                                onClick={() => updateQuantityHandler(item.product._id, item.quantity - 1)} 
                                                                type="button" 
                                                                className="border-none outline-none"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 121.805 121.804">
                                                                    <path d="M7.308 68.211h107.188a7.309 7.309 0 0 0 7.309-7.31 7.308 7.308 0 0 0-7.309-7.309H7.308a7.31 7.31 0 0 0 0 14.619z" data-original="#000000" />
                                                                </svg>
                                                            </button>
                                                            <span className="text-gray-800 text-sm font-semibold px-3">{item.quantity}</span>
                                                            <button 
                                                                onClick={() => updateQuantityHandler(item.product._id, item.quantity + 1)} 
                                                                type="button" 
                                                                className="border-none outline-none"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 512 512">
                                                                    <path d="M256 509.892c-19.058 0-34.5-15.442-34.5-34.5V36.608c0-19.058 15.442-34.5 34.5-34.5s34.5 15.442 34.5 34.5v438.784c0 19.058-15.442 34.5-34.5 34.5z" data-original="#000000" />
                                                                    <path d="M475.392 290.5H36.608c-19.058 0-34.5-15.442-34.5-34.5s15.442-34.5 34.5-34.5h438.784c19.058 0 34.5 15.442 34.5 34.5s-15.442 34.5-34.5 34.5z" data-original="#000000" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-green-600">
                                                            {item.price} EGP
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="divide-x border-y mt-6 flex items-center justify-center">
                                                    <button 
                                                        className="button" 
                                                        onClick={() => removeFromCartHandler(item.product._id)}
                                                    >
                                                        <svg viewBox="0 0 448 512" className="svgIcon">
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        {cartData?.products?.length > 0 && (
                            <div className="bg-white h-max p-4 shadow-[0_2px_9px_-3px_rgba(61,63,68,0.3)] sticky top-0">
                                <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
                                <ul className="text-gray-800 text-sm space-y-3 mt-4">
                                    <li className="flex flex-wrap gap-4">Subtotal <span className="ml-auto font-bold">{cartData.totalPrice} EGP</span></li>
                                    <li className="flex flex-wrap gap-4">Shipping <span className="ml-auto font-bold">Free</span></li>
                                    <li className="flex flex-wrap gap-4 font-bold">Total <span className="ml-auto">{cartData.totalPrice} EGP</span></li>
                                </ul>
                                <button 
                                    onClick={() => setIsOpenOrder(true)} 
                                    className="mt-6 text-sm px-4 py-2.5 w-full bg-green-700 transition-all duration-300 hover:bg-green-800 tracking-wide text-white"
                                >
                                    Make Payment
                                </button>
                                {/* <OrderModal 
                                    isOpenOrder={isOpenOrder} 
                                    setIsOpenOrder={setIsOpenOrder} 
                                    cartId={cartData._id} 
                                    totalPrice={cartData.totalPrice}
                                /> */}
                                <div className="mt-6 space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-2">Secure payment</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">Experience peace of mind with our secure payment options, ensuring your transactions are protected and reliable.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-2">Free delivery</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">Enjoy the convenience of free delivery on all your orders, providing a cost-effective and seamless shopping experience.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-2">Easy to return</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">Simplify your shopping experience with hassle-free returns. Our easy return process ensures convenience and customer satisfaction.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}