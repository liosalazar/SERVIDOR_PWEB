import BannerCarousel from "../../components/shop/BannerCarousel";
import FeaturedCategories from "../../components/shop/FeaturedCategories";
import BestSellers from "../../components/shop/BestSellers";
import NewCategories from "../../components/shop/NewCategories";
import NewProducts from "../../components/shop/NewProducts";

const HomePage = () => {
  return (
    <main>
      <BannerCarousel />
      <FeaturedCategories />
      <BestSellers />
      <NewCategories />
      <NewProducts /> {/* ahora el ProductCard solo agregará al localStorage y navegará a /carrito */}
    </main>
  );
};

export default HomePage;