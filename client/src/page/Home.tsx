import Banner from "@/components/desktop/Banner"
import Category from "@/components/desktop/Category"
import Footer from "@/components/desktop/Footer"
import Product from "@/components/desktop/Product"

const Home = () => {
    return (
        <div className="bg-gray-100 flex-col space-y-4">
            <Banner />
            <Category />
            <Product />
            <Footer />
        </div>
    )
}

export default Home