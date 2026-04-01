import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Banners } from "@/types";

const Banner = () => {
  const bannerArray: Banners[] = [
    {
      id: 1,
      img: "https://img.lazcdn.com/us/domino/5a53b7a5-0ba3-49a0-9abb-0d8a4fcc6ec9_BD-1976-688.jpg_2200x2200q80.jpg_.avif",
    },
    {
      id: 2,
      img: "https://via.placeholder.com/1200x500?text=Banner+2",
    },
    {
      id: 3,
      img: "https://via.placeholder.com/1200x500?text=Banner+3",
    },
    {
      id: 4,
      img: "https://via.placeholder.com/1200x500?text=Banner+4",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 mt-6 bg-white p-6">
      <Carousel className="relative rounded-xl overflow-hidden">
        {/* Carousel slides */}
        <CarouselContent>
          {bannerArray.map((item) => (
            <CarouselItem key={item.id}>
              <img
                src={item.img}
                alt={`Banner ${item.id}`}
                className="w-auto md:w-full h-60 md:h-87 object-cover rounded-xl"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation buttons */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10" />
      </Carousel>
    </section>
  );
};

export default Banner;